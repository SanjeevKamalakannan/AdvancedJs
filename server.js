const express = require('express')
const app = express()
var fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const axios = require("axios");
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get('/', (req, res) => res.render('index'));

//Assignment 1 => 3)question
app.get('/getprizes',(req,res) =>{
  const url = "http://api.nobelprize.org/v1/prize.json";
  const getData = async url => {
      const response = await axios.get(url);
      const data = response.data;
      var prizes = data.prizes;
      var chemprizes = prizes.filter(prize=> prize.year >= "2000" && prize.year <= "2019" && prize.category == "chemistry")  
      var laureatesnames = []
      chemprizes.forEach(chemprize =>{
        chemprize.laureates.forEach(chemprizelaureate =>{
          laureatesnames.push(chemprizelaureate.firstname+chemprizelaureate.surname)
        })
      })
      console.log(laureatesnames)
      res.json(laureatesnames) 
  };
  getData(url); 
});

//Assignment 2 => 2)question
app.get('/getqueens',(req,res) => {
  class QueenAttack {
    constructor({white = [0, 4], black = [7, 3]} = {}) {
      if (white[0] === black[0] && white[1] === black[1]) {
        throw 'Queens should not be in same block';
      }
      this.white = white;
      this.black = black;
    }
    toString() {
      let res = [];
      for (let i = 0; i < 8; i++) {
        res.push([...'________']);
      }
      res[this.white[0]][this.white[1]] = 'W';
      res[this.black[0]][this.black[1]] = 'B';
      return res.map(v => v.join(' ') + '\n').join('');
    }
    canAttack() {
      return this.white[0] === this.black[0] ||
        this.white[1] === this.black[1] ||
        Math.abs(this.white[0] - this.black[0]) ===
        Math.abs(this.white[1] - this.black[1]);
    }
  }
  let q = new QueenAttack();
  console.log(q.toString());
  if(q.canAttack() == true)
    console.log("Queens Attack each other")
  else
    console.log("Queens wont ttack each other")
})

//Assignment 1 => 2)Question
app.post('/getgithub',(req,res) =>{
  console.log(req.body.gitreq)
  const url = "https://api.github.com/search/repositories?q="+req.body.gitreq;
  console.log(url)
  const getData = async url => {
      var results = []
      const response = await axios.get(url);
      const datas = response.data.items;
      datas.forEach(data => {
        var licensename = ""
        if(data.license == null){
          licensename = "No License(Null value)"
        }
        else{
          licensename = data.license.name
        }
        let gitdata = {
          "name": data.name,
          "full_name": data.full_name,
          "private": data.private,
          "owner":{"login" : data.owner.login , "name" : data.name , "followerscount" :data.owner.followers_url, "followingcount" : data.owner.following_url },
          "licenseName" :licensename,
          "score" : data.score,
          "numberofbranches" : data.branches_url
        };
        //These four calls are made inside the loop. So executing all of 'em at once may cause 403 error.One at a time works fine. I've commented each of them at the bottom
        const nameurl = data.owner.url;
        console.log(nameurl)
        const getUrlName = async nameurl => {
          const response = await axios.get(nameurl);
          const apidatas = response.data
          const urlname = apidatas.name;
          gitdata['owner']['name'] = urlname
        }
        getUrlName(nameurl)

        const followerscounturl = data.owner.followers_url;
        console.log(followerscounturl)
        const getFollowersCount = async followerscounturl => {
            const response = await axios.get(followerscounturl);
            const apidatas = response.data
            const followerslength = apidatas.length;
            gitdata['owner']['followerscount'] = followerslength
        }
        getFollowersCount(followerscounturl) 

        const followingcounturl = data.owner.following_url.replace("{/other_user}","");
        console.log(followingcounturl)
        const getFollowingCount = async followingcounturl => {
          const response = await axios.get(followingcounturl);
          const apidatas = response.data
          const followinglength = apidatas.length;
          gitdata['owner']['followingcount'] = followinglength
        }
        getFollowingCount(followingcounturl)

        const branchescounturl = data.branches_url.replace("{/branch}","");
        console.log(branchescounturl)
        const getBranchesCount = async branchescounturl => {
            const response = await axios.get(branchescounturl);
            const apidatas = response.data
            const brancheslength = apidatas.length;
            gitdata['numberofbranches'] = brancheslength
        }
        getBranchesCount(branchescounturl)
        /* const nameurl = data.owner.url;
        console.log(nameurl)
        const getUrlName = async nameurl => {
          const response = await axios.get(nameurl);
          const apidatas = response.data
          const urlname = apidatas.name;
          gitdata['owner']['name'] = urlname
        }
        getUrlName(nameurl) */

        /* const followerscounturl = data.owner.followers_url;
        console.log(followerscounturl)
        const getFollowersCount = async followerscounturl => {
            const response = await axios.get(followerscounturl);
            const apidatas = response.data
            const followerslength = apidatas.length;
            gitdata['owner']['followerscount'] = followerslength
        }
        getFollowersCount(followerscounturl) */ 

        /* const followingcounturl = data.owner.following_url.replace("{/other_user}","");
        console.log(followingcounturl)
        const getFollowingCount = async followingcounturl => {
          const response = await axios.get(followingcounturl);
          const apidatas = response.data
          const followinglength = apidatas.length;
          gitdata['owner']['followingcount'] = followinglength
        }
        getFollowingCount(followingcounturl) */

        /* const branchescounturl = data.branches_url.replace("{/branch}","");
        console.log(branchescounturl)
        const getBranchesCount = async branchescounturl => {
            const response = await axios.get(branchescounturl);
            const apidatas = response.data
            const brancheslength = apidatas.length;
            gitdata['numberofbranches'] = brancheslength
        }
        getBranchesCount(branchescounturl) */
        results.push(gitdata)
      })
      setTimeout(function() {
        res.json(results)
        console.log(results)
      },6000);
  };
  getData(url); 
});

//Assignment 2 => 1)question
app.get('/getmovies', (req,res) =>{
  const url = "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json";
  const getData = async url => {
    const response = await axios.get(url)
    const movies = response.data;
    let movieobject = {
      "actors" : [],
      "genres" : []
    }
    var actors = []
    var genres = []
    movies.forEach(data=>{
      data.cast.forEach(name=>{
          if(actors.includes(name) == false)
          {
            let actorobject = {
            "name" : name,
            "movies" : [data.title]
            };
            movieobject.actors.push(actorobject)
            actors.push(name)
          }
          else
          {
              movieobject.actors.find((o,i) => {
              if(o.name == name)
              {
                movieobject.actors[i].movies.push(data.title)
              }
            })
          }
        })
      data.genres.forEach(type=>{
          if(genres.includes(type) == false)
          {
            let genreobject = {
            "type" : type,
            "movies" : [data.title]
            };
            movieobject.genres.push(genreobject)
            genres.push(type)
          }
          else
          {
            movieobject.genres.find((o,i) => {
              if(o.type == type)
              {
                movieobject.genres[i].movies.push(data.title)
              }
            })
          }
        })
      })
    res.json(movieobject)
    console.log(movieobject)
  }
  getData(url)  
})

//Assignment 1 => 1)question
app.get('/getbattles',(req, res) => {
    fs.readFile('battles.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      battles = JSON.parse(data);
      var resultobj = {
        'most_active':{
        },
        'attacker_outcome':{
        },
        'battle_type':[], 
        'defender_size':{
            }
        }
      //Active Attacker
      let attackers = [];
      battles.forEach((x)=>{
        if(attackers.some((val)=>{ return val["attacker_king"] == x["attacker_king"] })){
          attackers.forEach((k)=>{
            if(k["attacker_king"] === x["attacker_king"]){ 
              k["occurrence"]++
            }
          })
            
        }else{
          let a = {}
          a["attacker_king"] = x["attacker_king"]
          a["occurrence"] = 1
          attackers.push(a);
        }
      })
      var maxattacker = attackers.reduce((acc, attacker) => acc = acc > attacker.occurrence ? acc : attacker.occurrence, 0);
      var active_attacker = attackers.filter(attacker => attacker.occurrence == maxattacker)
      if(active_attacker.length == battles.length)
      {
        resultobj['most_active']['attacker_king'] = "All attacker kings battle only once";
      }
      else{
        resultobj['most_active']['attacker_king'] = active_attacker[0]['attacker_king'];
      }

      //Active Defender
      let defenders = [];
      battles.forEach((x)=>{
        if(defenders.some((val)=>{ return val["defender_king"] == x["defender_king"] })){
          defenders.forEach((k)=>{
            if(k["defender_king"] === x["defender_king"]){ 
              k["occurrence"]++
            }
          })
            
        }else{
          let a = {}
          a["defender_king"] = x["defender_king"]
          a["occurrence"] = 1
          defenders.push(a);
        }
      })
      var maxdefender = defenders.reduce((acc, defender) => acc = acc > defender.occurrence ? acc : defender.occurrence, 0);
      var active_defender = defenders.filter(defender => defender.occurrence == maxdefender)
      if(active_defender.length == battles.length)
      {
        resultobj['most_active']['defender_king'] = "All defender kings battle only once";
      }
      else{
        resultobj['most_active']['defender_king'] = active_defender[0]['defender_king'];
      }
      
      //Active Region
      let regions = [];
      battles.forEach((x)=>{
        if(regions.some((val)=>{ return val["region"] == x["region"] })){
          regions.forEach((k)=>{
            if(k["region"] === x["region"]){ 
              k["occurrence"]++
            }
          })
            
        }else{
          let a = {}
          a["region"] = x["region"]
          a["occurrence"] = 1
          regions.push(a);
        }
      })
      var maxregion = regions.reduce((acc, region) => acc = acc > region.occurrence ? acc : region.occurrence, 0);
      var active_region = regions.filter(region => region.occurrence == maxregion)
      if(active_region.length == battles.length)
      {
        resultobj['most_active']['region'] = "All Battles region occurr only once";
      }
      else{
        resultobj['most_active']['region'] = active_region[0]['region'];
      }

      //Active Names
      let names = [];
      battles.forEach((x)=>{
        if(names.some((val)=>{ return val["name"] == x["name"] })){
          names.forEach((k)=>{
            if(k["name"] === x["name"]){ 
              k["occurrence"]++
            }
          })
            
        }else{
          let a = {}
          a["name"] = x["name"]
          a["occurrence"] = 1
          names.push(a);
        }
      })
      var maxname = names.reduce((acc, name) => acc = acc > name.occurrence ? acc : name.occurrence, 0);
      var active_name = names.filter(name => name.occurrence == maxname)
      if(active_name.length == battles.length)
      {
        resultobj['most_active']['name'] = "All Battles names occurr only once";
      }
      else{
        resultobj['most_active']['name'] = active_name[0]['name'];
      }
      
      //Attacker Outcome Win and Loss
      let outcomes = [];
      battles.forEach((x)=>{
        if(outcomes.some((val)=>{ return val["attacker_outcome"] == x["attacker_outcome"] })){
          outcomes.forEach((k)=>{
            if(k["attacker_outcome"] === x["attacker_outcome"]){ 
              k["occurrence"]++
            }
          })
            
        }else{
          let a = {}
          a["attacker_outcome"] = x["attacker_outcome"]
          a["occurrence"] = 1
          outcomes.push(a);
        }
      })
      var win = outcomes.find(outcomes => outcomes.attacker_outcome == "win")
      var loss = outcomes.find(outcomes => outcomes.attacker_outcome == "loss")
      resultobj['attacker_outcome']['win'] = win.occurrence
      resultobj['attacker_outcome']['loss'] = loss.occurrence

      //Unique Battle Type
      const unique = [...new Set(battles.map(item => item.battle_type))];
      const index = unique.indexOf("");
      if (index > -1) {
        unique.splice(index, 1);
      }
      resultobj['battle_type'] = unique

      //Defender Size Min/Max/Average
      var newbattles = battles.filter(battle => battle.defender_size != null)
      function getmindefenders(){
        return newbattles.reduce((min, b) => Math.min(min, b.defender_size), battles[0].defender_size);
      }
      function getmaxdefenders(){
        return battles.reduce((max, b) => Math.max(max, b.defender_size), battles[0].defender_size);
      }
      const getavgdefenders = (arr) => {
        const { length } = arr;
        return arr.reduce((acc, val) => {
           return acc + (val.defender_size/length);
        }, 0);
      };
      var minDefenders = getmindefenders()
      var maxDefenders = getmaxdefenders()
      var avgDefenders = Math.round(getavgdefenders(battles))

      resultobj['defender_size']['min'] = minDefenders
      resultobj['defender_size']['max'] = maxDefenders
      resultobj['defender_size']['avg'] = avgDefenders
      res.json(resultobj) 
      console.log(resultobj)
    }});
})

  
app.listen(3000)