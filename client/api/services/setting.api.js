import axios from 'axios';

export const getSetting = async (queries) => {
  try {
    const { data } = await axios.get('/settings', queries);

    document.body.classList[data.payload.dark ? 'add' : 'remove']('dark');
    return data.payload;
  } catch (error0) {
    console.error(error0.message);

    return null;
  }
};
