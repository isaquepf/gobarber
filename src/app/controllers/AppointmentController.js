const { User, Appointment } = require('../models');
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentController {
    async create(req, res) {
        const provider = await User.findByPk(req.params.provider );

        return res.render('appointments/create', { provider });
    }

    async store (req, res) {
        const { id } = req.session.user;
        const { provider } = req.params;
        const { date } = req.body;

        await Appointment.create({
            user_id: id, 
            provider_id: provider,
            date 
        });

      return res.redirect('/app/dashboard');          
    }

    async my(req, res) {        
        const appointments = await Appointment.findAll({
            include: [{ model: User, as: 'user' }],
            where: {
              provider_id: req.session.user.id,
              date: {
                [Op.between]: [
                  moment()
                    .startOf('day')
                    .format(),
                  moment()
                    .endOf('day')
                    .format()
                ]
              }
            }
          });

          if (!appointments) 
            req.flash('error', 'Não foram encontrados agendamentos.');
            
        return res.render('appointments/my', { appointments });
    }
}

module.exports = new AppointmentController();