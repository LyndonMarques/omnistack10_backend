const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiRes = await axios.get(
        `https://api.github.com/users/${github_username}`
      ).catch((err) => {
        return res.status(404).json({
                msg: "Usurio não encontrado no GitHub"
            });
     });

      let { name = login, avatar_url, bio } = apiRes.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
    }

    return res.json(dev);
  },

 
  async update(req, res) {
    const { _id, github_username, name, techs, latitude, longitude } = req.body;     
    
    //Verifica se o id do usuario existe
    let dev = await Dev.findOne({ _id })
     .catch((err) => {
        return res.status(404).json({
                msg: "Usurio não encontrado",
                error: err
            });
     })
    
    //Faz a tratativa da string de techs para objeto do mongoose
    const techsArray = parseStringAsArray(techs);

    const filter = { _id };//Variavel para filtrar o id do usuario
    const location = {
        type: "Point",
        coordinates: [longitude, latitude],
    };//Tratativa para as coordenadas
    
    const update = {
      github_username,
      name,
      techs: techsArray,
      location,
    };//Objeto a serem alterados

    let dev1 = await Dev.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    }); //Procura pelo usuario e faz o update na linha

    return res.json(dev1);
  },

  
  async destroy(req, res) {

    const { _id } = req.params

    //Verifica se o id do usuario existe
    let dev = await Dev.findOne({ _id })
     .catch((err) => {
        return res.status(404).json({
                msg: "Usurio não encontrado",
                error: err
            });
     })
    
    if (dev) {

      await Dev.deleteOne({ _id })
      .then((data) => {
        const msg = {
          msg: `Usuario: '${dev.name}' foi deletado com sucesso!`
        };

        return res.json(msg)
      }); 

    } else {

      return res.status(404).json({
                msg: "Usurio não encontrado"
            });
    }       
  }
};
