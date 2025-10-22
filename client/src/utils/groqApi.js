import { Groq } from 'groq-sdk';

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const processDocumentWithGroq = async (file) => {
  try {
    const base64Image = await getBase64(file);
    const groq = new Groq({
      apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract ONLY this JSON from the income tax document/payslip: {\"name\": string, \"basicSalary\": number, \"allowance\": number, \"bonus\": number}. Rules: 1) Values MUST be ANNUAL amounts in RM. If monthly amounts, multiply by 12. 2) If a field is missing, set it to 0. 3) Do NOT include any extra text."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.1,
      max_completion_tokens: 300,
      top_p: 1,
      stream: false
    });

    const responseText = chatCompletion.choices[0].message.content.trim();
    
    try {
      const parsedData = JSON.parse(responseText);
      const basicSalary = Number(parsedData.basicSalary) || 0;
      const allowance = Number(parsedData.allowance) || 0;
      const bonus = Number(parsedData.bonus) || 0;
      const name = parsedData.name || null;
      return {
        name,
        basicSalary,
        allowance,
        bonus,
        annualIncome: basicSalary + allowance + bonus,
        documentExtracted: true
      };
    } catch (parseError) {
      console.error('Failed to parse JSON response:', responseText);
      return {
        name: null,
        basicSalary: 0,
        allowance: 0,
        bonus: 0,
        annualIncome: 0,
        documentExtracted: false
      };
    }

  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process document');
  }
};