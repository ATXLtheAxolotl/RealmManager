import { Authflow } from 'prismarine-auth'
import { RealmAPI } from 'prismarine-realms'
import axios from 'axios'
const select = require('@inquirer/select');
const inquirer = require('inquirer');

const authflow = new Authflow(``, `./auth`)
const api = RealmAPI.from(authflow, 'bedrock')

    

async function prompt() {
    const realms = await api.getRealms()
    var options = []
    const xuid = (await authflow.getXboxToken()).userXUID
    realms.forEach(async realm => {
        if(realm.state === 'CLOSED') return;
        if(realm.ownerUUID !== xuid) return;
        
        options.push({ name: realm.name, value: realm.id, description: realm.motd })
    })
    
    const name = (await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Insert the desired name."
        }
      ])).name;

    const answer = await select({
        message: 'Select a realm',
        choices: options,
      });

    api['rest'].post(`/worlds/${answer}`, {
        body: {
            name: name,
            description: realms.find(realm => realm.id === answer).motd
        }
    })
}
prompt()