const { connect } = require('mongoose');

module.exports = async () => {
  try {
    const uri =
      'mongodb+srv://rohitjha1:mPAnT8Vz4QAoqdh7@cluster0.oromcia.mongodb.net/?retryWrites=true&w=majority';
    await connect(uri);

    console.log('database connected');
  } catch (error0) {
    console.log(error0.message);
  }
};
