const axios = require('axios');

const cityMap = {
  'sao-paulo': 'Sao Paulo,BR',
  'sao paulo': 'Sao Paulo,BR',
  'damasco': 'Damascus,SY',
  'damascus': 'Damascus,SY',
  'dhaka': 'Dhaka,BD',
  'bangladesh': 'Dhaka,BD',
  'blangadesh': 'Dhaka,BD'
};

module.exports = async (req, res) => {
  try {
    const q = (req.query.city || 'sao-paulo').toLowerCase();
    const city = cityMap[q] || req.query.city;
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) return res.status(500).json({ error: 'OPENWEATHER_API_KEY não definido' });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}&lang=pt_br`;
    const r = await axios.get(url);
    const { main, wind, name } = r.data;
    res.status(200).json({
      city: name,
      temp: main.temp,
      temp_min: main.temp_min,
      temp_max: main.temp_max,
      wind_speed: wind?.speed ?? null
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'falha ao obter dados', details: err.response?.data || err.message });
  }
};