// Gemini API model test script
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY bulunamadı!');
  console.error('.env dosyasında GEMINI_API_KEY olduğundan emin olun.');
  process.exit(1);
}

console.log(`🔑 API Key uzunluğu: ${apiKey.length} karakter`);
console.log(`🔑 API Key başlangıcı: ${apiKey.substring(0, 10)}...`);

const genAI = new GoogleGenerativeAI(apiKey);

// Farklı model isimlerini test et
const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro'
];

async function listModels() {
  try {
    console.log('\n📋 Mevcut modeller listeleniyor...');
    // ListModels API'sini kullanarak mevcut modelleri görelim
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('\n✅ Mevcut modeller:');
      data.models.forEach(model => {
        if (model.name.includes('gemini')) {
          console.log(`   - ${model.name}`);
          console.log(`     Display Name: ${model.displayName || 'N/A'}`);
        }
      });
      return data.models.filter(m => m.name.includes('gemini')).map(m => m.name.replace('models/', ''));
    }
    return [];
  } catch (error) {
    console.log(`❌ Model listesi alınamadı: ${error.message}`);
    return [];
  }
}

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Test ediliyor: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Merhaba, test mesajı');
    const response = await result.response;
    console.log(`✅ BAŞARILI: ${modelName}`);
    console.log(`Yanıt: ${response.text().substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.log(`❌ HATA: ${modelName}`);
    if (error.message) {
      console.log(`   ${error.message}`);
    }
    if (error.cause) {
      console.log(`   Detay: ${JSON.stringify(error.cause).substring(0, 200)}`);
    }
    return false;
  }
}

async function main() {
  console.log('🔍 Gemini API model testi başlatılıyor...\n');
  
  // Önce mevcut modelleri listele
  const availableModels = await listModels();
  
  if (availableModels.length > 0) {
    console.log('\n📝 Mevcut modellerle test ediliyor...');
    for (const modelName of availableModels) {
      const success = await testModel(modelName);
      if (success) {
        console.log(`\n✅ ÇALIŞAN MODEL: ${modelName}`);
        console.log(`\n.env dosyanıza ekleyin: GEMINI_MODEL=${modelName}`);
        return;
      }
    }
  }
  
  // Eğer liste alınamazsa, standart modelleri dene
  console.log('\n📝 Standart modellerle test ediliyor...');
  for (const modelName of modelsToTest) {
    const success = await testModel(modelName);
    if (success) {
      console.log(`\n✅ ÇALIŞAN MODEL: ${modelName}`);
      console.log(`\n.env dosyanıza ekleyin: GEMINI_MODEL=${modelName}`);
      break;
    }
  }
  
  console.log('\n❌ Hiçbir model çalışmadı!');
  console.log('\n🔧 Kontrol edin:');
  console.log('1. API Key doğru mu? (Google AI Studio\'dan alınmalı: https://makersuite.google.com/app/apikey)');
  console.log('2. API Key .env dosyasında mı?');
  console.log('3. API Key geçerli mi? (Google AI Studio\'da kontrol edin)');
}

main().catch(console.error);

