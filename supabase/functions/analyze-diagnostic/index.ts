
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

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

        // 1. Upsert Client (if email exists)
        let clientId = null;
        let clientErrorLog = null;
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

            if (clientError) {
                console.error('Client DB Error:', clientError)
                clientErrorLog = clientError;
            }
            if (client) clientId = client.id
        }

        // 2. Insert Diagnostic Record (Processing)
        let diagnosticId = null;
        let diagErrorLog = null;
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

        if (diagError) {
            console.error('Diagnostic DB Error:', diagError)
            diagErrorLog = diagError;
        }
        if (diagnostic) diagnosticId = diagnostic.id

        // 3. AI Analysis (Generative Step) - WRAPPED IN TRY/CATCH
        let aiAnalysis = null;
        if (GEMINI_API_KEY) {
            try {
                const prompt = `
              Você é LUCIUS, um Consultor de Negócios de Elite e Estrategista de IA.
              Sua missão é analisar diagnósticos empresariais e fornecer clareza imediata e estratégica.
              
              PERSONALIDADE:
              - Visionário, direto e altamente profissional.
              - Use uma linguagem executiva, mas acessível.
              - Seja encorajador, mas realista sobre os problemas.
              
              DADOS DA EMPRESA:
              Nome: ${companyName || "Empresa"}
              Nota Global: ${globalScore}/100
              
              ÁREAS E PONTUAÇÃO:
              ${areas.map((a: any) => `- ${a.name}: ${a.score}`).join('\n')}
    
              INSTRUÇÕES DE SAÍDA:
              1. Resumo Executivo (3 linhas max): Uma análise estratégica de alto nível sobre a maturidade atual.
              2. 3 Áreas Críticas: Para as 3 áreas com menores notas, dê 1 conselho tático e acionável ('quick win').
              3. Frase Motivacional: Uma frase final poderosa, no estilo "Lucius", inspirando ação e crescimento.
    
              FORMATO JSON OBRIGATÓRIO:
              {
                "executiveSummary": "texto...",
                "topCriticalAreas": [
                  { "areaName": "nome", "advice": "conselho..." }
                ],
                "closingMotivation": "frase..."
              }
            `

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                })

                const data = await response.json()
                if (!response.ok) {
                    console.error("Gemini API Error (Non-fatal):", data);
                } else {
                    let aiText = data.candidates[0].content.parts[0].text
                    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim()
                    aiAnalysis = JSON.parse(aiText)
                }
            } catch (aiError) {
                console.error("AI Generation Logic Error (Non-fatal):", aiError)
            }
        } else {
            console.warn("GEMINI_API_KEY not set.");
        }

        // 4. Update Diagnostic Record (Completed)
        if (diagnosticId) {
            await supabaseAdmin
                .from('diagnostics')
                .update({
                    ai_analysis: aiAnalysis || {
                        executiveSummary: "A conexão com Lucius está temporariamente indisponível. Seus dados foram salvos com segurança.",
                        topCriticalAreas: [],
                        closingMotivation: "Continue focado na evolução."
                    },
                    status: 'completed'
                })
                .eq('id', diagnosticId)
        }

        // Return success even if AI failed, but include AI result if available
        const fallbackResponse = {
            executiveSummary: "A conexão com Lucius está temporariamente indisponível. Seus dados foram salvos com segurança.",
            topCriticalAreas: [],
            closingMotivation: "Continue focado na evolução."
        };

        return new Response(
            JSON.stringify(aiAnalysis || fallbackResponse),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Edge Function Fatal Error:', error)
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 })
    }
})
