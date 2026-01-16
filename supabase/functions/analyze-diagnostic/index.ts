
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = "AIzaSyBwwwcqP0cWancfLpGh0RL9OqLH1PGy6U4"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { answers, areas, globalScore, companyName, leadData } = await req.json()

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Upsert Client (if email exists)
        let clientId = null;
        if (leadData?.email) {
            const { data: client, error: clientError } = await supabaseAdmin
                .from('clients')
                .upsert({
                    email: leadData.email,
                    nome_fantasia: companyName,
                    whatsapp: leadData.whatsapp,
                    responsavel: leadData.name,
                    updated_at: new Date()
                }, { onConflict: 'email' })
                .select()
                .single()

            if (clientError) console.error('Client DB Error:', clientError)
            if (client) clientId = client.id
        }

        // 2. Insert Diagnostic Record (Processing)
        let diagnosticId = null;
        const { data: diagnostic, error: diagError } = await supabaseAdmin
            .from('diagnostics')
            .insert({
                client_id: clientId,
                global_score: globalScore,
                area_scores: areas,
                client_info: leadData,
                responses: answers,
                status: 'processing',
                ai_analysis: null
            })
            .select()
            .single()

        if (diagError) console.error('Diagnostic DB Error:', diagError)
        if (diagnostic) diagnosticId = diagnostic.id

        // 3. AI Analysis (Generative Step) - WRAPPED IN TRY/CATCH
        let aiAnalysis = null;
        try {
            const prompt = `
          Você é um Consultor de Negócios de Elite.
          DADOS DA EMPRESA:
          Nome: ${companyName || "Empresa"}
          Nota Global: ${globalScore}/100
          
          ÁREAS:
          ${areas.map((a: any) => `- ${a.name}: ${a.score}`).join('\n')}

          INSTRUÇÕES:
          1. Resumo Executivo (3 linhas max): Avaliação dura mas construtiva.
          2. 3 Áreas Críticas (menores notas): 1 conselho prático para cada.
          3. Frase motivacional final.

          FORMATO JSON:
          {
            "executiveSummary": "texto",
            "topCriticalAreas": [
              { "areaName": "nome", "advice": "texto" }
            ],
            "closingMotivation": "texto"
          }
        `

            // Using gemini-1.5-flash as originally intended
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            })

            const data = await response.json()
            if (!response.ok) {
                console.error("Gemini API Error (Non-fatal):", data);
                // We allow normal flow to continue so data is saved even if AI fails
            } else {
                let aiText = data.candidates[0].content.parts[0].text
                aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim()
                aiAnalysis = JSON.parse(aiText)
            }
        } catch (aiError) {
            console.error("AI Generation Logic Error (Non-fatal):", aiError)
        }

        // 4. Update Diagnostic Record (Completed)
        if (diagnosticId) {
            await supabaseAdmin
                .from('diagnostics')
                .update({
                    ai_analysis: aiAnalysis || {
                        executiveSummary: "A análise de IA está temporariamente indisponível. Seus dados foram salvos com sucesso.",
                        topCriticalAreas: [],
                        closingMotivation: "Continue focado na melhoria constante."
                    },
                    status: 'completed'
                })
                .eq('id', diagnosticId)
        }

        // Return success even if AI failed, but include AI result if available
        return new Response(
            JSON.stringify(aiAnalysis || { message: "Data saved, AI unavailable" }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Edge Function Fatal Error:', error)
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 })
    }
})
