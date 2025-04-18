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
              text: "Extract the following information from this income tax document or payslip and return ONLY a valid JSON object with this format: {\"name\": string, \"totalIncome\": number, \"totalRelief\": number, \"totalRebate\": number, \"salary\": number, \"deductions\": number}. For income tax documents: totalIncome = total annual income, totalRelief = total tax relief, totalRebate = tax rebate received. For payslips: calculate monthly values into annual values (multiply by 12). No additional text."
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
      max_completion_tokens: 500,
      top_p: 1,
      stream: false
    });

    const responseText = chatCompletion.choices[0].message.content.trim();
    
    try {
      const parsedData = JSON.parse(responseText);
      return {
        name: parsedData.name || null,
        annualIncome: parsedData.totalIncome || (parsedData.salary ? parsedData.salary * 12 : null),
        annualExpenses: parsedData.totalRelief || (parsedData.deductions ? parsedData.deductions * 12 : null),
        zakatPaid: parsedData.totalRebate || null,  // Changed from totalIncomeTax to totalRebate
        salary: parsedData.salary || null,
        deductions: parsedData.deductions || null
      };
    } catch (parseError) {
      console.error('Failed to parse JSON response:', responseText);
      return {
        name: null,
        annualIncome: null,
        annualExpenses: null,
        zakatPaid: null,
        salary: null,
        deductions: null
      };
    }

  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process document');
  }
};