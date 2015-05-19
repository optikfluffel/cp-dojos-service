var path = require('path');
module.exports = function() {

  // Utility function for local development running with boot2docker
  // where we need the ip address of boot2docker instead of localhost.
  // This is for accessing containerised services.
  function localhost() {
    if (process.env.DOCKER_HOST) {
      return require('url').parse(process.env.DOCKER_HOST).hostname;
    }
    if (process.env.TARGETIP) {
      return process.env.TARGETIP;
    }	
    return '127.0.0.1';
  }

  function pgConfig() {
    return {
      name: process.env.POSTGRES_NAME,
      host: process.env.POSTGRES_HOST || localhost(),
      port: process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD
    }
  };

  function esConfig() {
    return {
      connection: {
        host : localhost() + ':9200',
        index: process.env.ES_INDEX,
        sniffOnStart: false,
        sniffInterval: false
      }
    };
  }

  return {
    'postgresql-store': pgConfig(),
    elasticsearch: esConfig(),
    'email-notifications': {
      sendemail:true,
      email: {
        'invite-mentor':{
          subject:'New Dojo Mentor Invitation'
        },
        'mentor-request-to-join':{
          subject:'New Mentor Request to Join your Dojo'
        }
      }
    },
    mail: {
      folder: path.resolve(__dirname + '/../email-templates'),
      mail: {
        from:'no-reply@coderdojo.com'
      },
      config: {
        host: "mailtrap.io",
        port: 2525,
        auth: {
          user: "3549359982ed10489",
          pass: "979ef86b786a46"
        }
        // service: 'Gmail',
        // auth: {
        //   user: 'youremail@example.com',
        //   pass: 'yourpass'
        // }
      }
    },
    transport: {
      type: 'web',
      web: {
        host: '0.0.0.0',
        port: 10301
      }
    }
  };
}
