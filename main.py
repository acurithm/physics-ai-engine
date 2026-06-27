import os
import json
from groq import Groq
from tools import solve_physics, calculate_distance

# Yeh system environment se key lega, code mein hard-code nahi hoga
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def execute_tool(tool_name, params):
    try:
        if tool_name == "solve_physics":
            return solve_physics(params['u'], params['v'], params['t'])
        elif tool_name == "calculate_distance":
            return calculate_distance(params['u'], params['t'], params['a'])
        else:
            return "Error: Unknown tool."
    except KeyError as e:
        return f"Error: Missing parameter {e}"

def get_ai_order(question):
    prompt = f"Extract u, v, t, a from: {question}. Return ONLY JSON: {{\"tool\": \"solve_physics\", \"params\": {{\"u\": 10, \"v\": 20, \"t\": 5}}}}"
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)