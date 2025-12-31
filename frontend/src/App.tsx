import React, { useState, useEffect } from 'react';
import type { WeightClass, Fighter} from './types';
import { Navbar } from './components/Navbar';
import { FighterInfo } from './components/FighterInfo'; 
import { RankingsList } from './components/RankingsList';
import { mapRankingsToFighterType, formatDate } from './functions/util'
import { ThreeDot } from "react-loading-indicators";
import { apiGet } from "../src/functions/util"
import type { RawRankings, NormalizedRankings} from "../src/functions/util"


const dummyFights = [
  {
    fight_id: "1",
    event: {
      event_name: "UFC 285",
      event_date: "2023-03-04",
      venue: "T-Mobile Arena",
      city: "Las Vegas",
      country: "USA"
    },
    weight_class: "Light Heavyweight",
    finish_method: "KO/TKO",
    round: 2,
    time_in_round: "3:15",
    odds: { fighter: -150, opponent: +130 },
    fighter: {
      fighter_id: "2335639",
      first_name: "Jon",
      last_name: "Jones",
      stats: {
        strikes_landed: 50,
        strikes_attempted: 60,
        takedowns_landed: 1,
        takedowns_attempted: 2,
        submissions_attempted: 0,
        knockdowns: 1
      },
      image_url: "https://a.espncdn.com/i/headshots/mma/players/full/2335639.png"
    },
    opponent: {
      fighter_id: "1234567",
      first_name: "Ciryl",
      last_name: "Gane",
      stats: {
        strikes_landed: 30,
        strikes_attempted: 40,
        takedowns_landed: 0,
        takedowns_attempted: 1,
        submissions_attempted: 0,
        knockdowns: 0
      },
      image_url: "https://randomuser.me/api/portraits/men/2.jpg"
    }
  }
];

const dummyResponse = {
  "Men Heavyweight": [
    {
      "fighter_id": "bc84498719596eaa12af26aaa8260b1fb6b7fa02c520b7cae0370ea38a82fbc3",
      "first_name": "Alexander",
      "last_name": "Volkov",
      "nickname": "Drago",
      "weight_class": "Men Heavyweight",
      "elo_score": 1649.94
    },
    {
      "fighter_id": "1576fd14825a7ef5e1059387ee2a249dd91c4f0797a6e50921f71852293a637e",
      "first_name": "Francis",
      "last_name": "Ngannou",
      "nickname": "The Predator",
      "weight_class": "Men Heavyweight",
      "elo_score": 1614.05
    },
    {
      "fighter_id": "bbab7244e17cd01a283e53ad7345903121733a379c3c2ddbda3b4c59e519f955",
      "first_name": "Curtis",
      "last_name": "Blaydes",
      "nickname": "Razor",
      "weight_class": "Men Heavyweight",
      "elo_score": 1606.8
    },
    {
      "fighter_id": "3a3ad788739def783f9fc42a5d005430ba4883e1c8df3bb87cab8080518eda9b",
      "first_name": "Tom",
      "last_name": "Aspinall",
      "nickname": null,
      "weight_class": "Men Heavyweight",
      "elo_score": 1602.63
    },
    {
      "fighter_id": "560a641f691ed371b013a85f2a40632c29a93f3a6b83796c56c88dae5437279c",
      "first_name": "Ciryl",
      "last_name": "Gane",
      "nickname": "Bon Gamin",
      "weight_class": "Men Heavyweight",
      "elo_score": 1591.96
    },
    {
      "fighter_id": "8056a769369d5b986f582e180e9ffa8c27ca5e3a3d7ed46ac1c22ea1314bb6d9",
      "first_name": "Waldo Cortes",
      "last_name": "Acosta",
      "nickname": "Salsa Boy",
      "weight_class": "Men Heavyweight",
      "elo_score": 1588.94
    },
    {
      "fighter_id": "cf9c5e81640fd8d10e934870a6c15f541e29d1a7f13a28a29938ff23f21ce0bb",
      "first_name": "Martin",
      "last_name": "Buday",
      "nickname": "Badys",
      "weight_class": "Men Heavyweight",
      "elo_score": 1587.02
    },
    {
      "fighter_id": "e35f92080d7fddd331c5b8a4faef85fc00535bc6c4099d58a8b4a7a1e39cbec4",
      "first_name": "Junior Dos",
      "last_name": "Santos",
      "nickname": "Cigano",
      "weight_class": "Men Heavyweight",
      "elo_score": 1587
    },
    {
      "fighter_id": "f16ab1bc7a1df088a4db3069a45280637d6921d9f60b7a6a00a5845c08b990b3",
      "first_name": "Alistair",
      "last_name": "Overeem",
      "nickname": "The Demolition Man",
      "weight_class": "Men Heavyweight",
      "elo_score": 1580.16
    },
    {
      "fighter_id": "a595fd854757b65f73275ea5a234fe8537886c12a94270699cc77bab5cea617c",
      "first_name": "Sergei",
      "last_name": "Pavlovich",
      "nickname": null,
      "weight_class": "Men Heavyweight",
      "elo_score": 1573.72
    },
    {
      "fighter_id": "e86fe60bb7cd3a98a0bd2b700c24ea014827aa7d720927ae9997a7066ffc6c81",
      "first_name": "Alexandr",
      "last_name": "Romanov",
      "nickname": "King Kong",
      "weight_class": "Men Heavyweight",
      "elo_score": 1570.71
    },
    {
      "fighter_id": "e4e84c6a1093d0b97c142d9041289c34979180a8b5feb18eba7c5d81af0de04a",
      "first_name": "Derrick",
      "last_name": "Lewis",
      "nickname": "The Black Beast",
      "weight_class": "Men Heavyweight",
      "elo_score": 1570.57
    },
    {
      "fighter_id": "74b4016fed8200d3a4d764cd639aa9a2560dc9fca0aa07fe04abb2b08b4ff0ff",
      "first_name": "Marcos Rogerio de",
      "last_name": "Lima",
      "nickname": "Pezao",
      "weight_class": "Men Heavyweight",
      "elo_score": 1567.41
    },
    {
      "fighter_id": "06bd4c957f7a4d9d013d17a754edf3c368e4a2c62be85959cf52f337fd488342",
      "first_name": "Tim",
      "last_name": "Sylvia",
      "nickname": "The Maine-iac",
      "weight_class": "Men Heavyweight",
      "elo_score": 1566.96
    },
    {
      "fighter_id": "65fa6ad13d6af1f3e3cc4feadfc30d89aa6ce94db119b1d2eb139296e5158a15",
      "first_name": "Valter",
      "last_name": "Walker",
      "nickname": "The Clean Monster",
      "weight_class": "Men Heavyweight",
      "elo_score": 1564.51
    }
  ],
  "Men Light Heavyweight": [
    {
      "fighter_id": "fe51b692675a3e80222398009be4dcb1dff61dd3c13ed8d98810d6501f092cca",
      "first_name": "Jon",
      "last_name": "Jones",
      "nickname": "Bones",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1727.51
    },
    {
      "fighter_id": "4a52a7853453d569b57d850e366c198f4fd7e2629f366b8ad98c753f6087d47e",
      "first_name": "Alex",
      "last_name": "Pereira",
      "nickname": "Poatan",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1647.06
    },
    {
      "fighter_id": "651e90ad41f103cd4cd4106596bb1898a0cbed7307e7051d25c237dee2eba39c",
      "first_name": "Daniel",
      "last_name": "Cormier",
      "nickname": "DC",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1616.71
    },
    {
      "fighter_id": "59695a13cfe4b4e7cdf6aca627bd243b845d480edc20e59f00dd04546979c719",
      "first_name": "Carlos",
      "last_name": "Ulberg",
      "nickname": "Black Jag",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1612.73
    },
    {
      "fighter_id": "618ff6763928ed62265e1deb0ac89bb8804551ad4c6b88c06021a10154d007b4",
      "first_name": "Magomed",
      "last_name": "Ankalaev",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1606.7
    },
    {
      "fighter_id": "11eb0c2a1496f365b91f8d15728dce988efaa1a8b882089f179fd6fb7c7fa97f",
      "first_name": "Azamat",
      "last_name": "Murzakanov",
      "nickname": "The Professional",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1587.11
    },
    {
      "fighter_id": "24427cf543a79a5df54f0361cb287dfae7b4a7ed69f1ba68e762599ed952457f",
      "first_name": "Jan",
      "last_name": "Blachowicz",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1579.97
    },
    {
      "fighter_id": "e6807305b3dfdd826fbe98830f6dc26268e3b8a06943fa6cc9e68147ea7e5a58",
      "first_name": "Alexander",
      "last_name": "Gustafsson",
      "nickname": "The Mauler",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1579.56
    },
    {
      "fighter_id": "f3a514b9ab0e043837d6714b6d690c90a0500475ba871b89010b5b3ef0b53859",
      "first_name": "Vitor",
      "last_name": "Petrino",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1575.12
    },
    {
      "fighter_id": "c1135a700df3b12b49a95fd3dc2e2611dc6a35898acd265e09a180351488d2ae",
      "first_name": "Jiri",
      "last_name": "Prochazka",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1571.08
    },
    {
      "fighter_id": "3c65641ba304408d24e3eb11c3e00a4fdbb23371145c7f932240ff79b9349417",
      "first_name": "Ilir",
      "last_name": "Latifi",
      "nickname": "The Sledgehammer",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1570.83
    },
    {
      "fighter_id": "10d438f234c694fdf73ed372fa54f09d4d4a45cdb53082d665640444d19c9e29",
      "first_name": "Glover",
      "last_name": "Teixeira",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1570.26
    },
    {
      "fighter_id": "4d7def3c6bb165f2c0c954866943b8d6d0943f1ff5705625a5608d8a36621937",
      "first_name": "Nikita",
      "last_name": "Krylov",
      "nickname": "The Miner",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1566.76
    },
    {
      "fighter_id": "4aef892f73fff3bf6a959b78428edfaecbed61f3051a27a54d20d88a4f2568ce",
      "first_name": "Chuck",
      "last_name": "Liddell",
      "nickname": "The Iceman",
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1565.73
    },
    {
      "fighter_id": "5a612721b9e4ae5a051a2448bdb4fac1b1724005dd2942a855c9d3160ba3b1fb",
      "first_name": "Ovince Saint",
      "last_name": "Preux",
      "nickname": null,
      "weight_class": "Men Light Heavyweight",
      "elo_score": 1565.34
    }
  ],
  "Men Middleweight": [
    {
      "fighter_id": "351ebdfac02d54f154d4b15d3388d8823b55e4ffd00143043fd4a33477eb48d4",
      "first_name": "Dricus Du",
      "last_name": "Plessis",
      "nickname": "Stillknocks",
      "weight_class": "Men Middleweight",
      "elo_score": 1673.16
    },
    {
      "fighter_id": "b2542c78997ad7ae2c9275c4badbb16963d3d59d24befdeb993ca2d70ccaaaf0",
      "first_name": "Anthony",
      "last_name": "Hernandez",
      "nickname": "Fluffy",
      "weight_class": "Men Middleweight",
      "elo_score": 1634.6
    },
    {
      "fighter_id": "bc7f53c208f017c66cd51136ed496b7207738709aa7ba3900981f9501b7405c9",
      "first_name": "Nassourdine",
      "last_name": "Imavov",
      "nickname": "The Sniper",
      "weight_class": "Men Middleweight",
      "elo_score": 1624.25
    },
    {
      "fighter_id": "a3d7350e7ceb22ff34a6f809373cf39d96e8bcfb7e26753932a3ebf193f1a81a",
      "first_name": "Joaquin",
      "last_name": "Buckley",
      "nickname": "New Mansa",
      "weight_class": "Men Middleweight",
      "elo_score": 1619.65
    },
    {
      "fighter_id": "67f4371ab451ff5c41b748ab2f2a750a529741322cde21aeb95357b26fd88d65",
      "first_name": "Brendan",
      "last_name": "Allen",
      "nickname": "All In",
      "weight_class": "Men Middleweight",
      "elo_score": 1614.95
    },
    {
      "fighter_id": "71eda29cc2e6197621e9dfeadcc2d0bcfc7c5bf830bb55b72c3a32c0c6845289",
      "first_name": "Caio",
      "last_name": "Borralho",
      "nickname": "The Natural",
      "weight_class": "Men Middleweight",
      "elo_score": 1610.3
    },
    {
      "fighter_id": "d2e387a12f39043618d2346ab8f79e622870a2087940bc06902f807c95b10939",
      "first_name": "Bryan",
      "last_name": "Battle",
      "nickname": "The Butcher",
      "weight_class": "Men Middleweight",
      "elo_score": 1608.39
    },
    {
      "fighter_id": "07f0e234dad754a095262195955eba5af8a6468288182b4d930f517685bf335c",
      "first_name": "Robert",
      "last_name": "Whittaker",
      "nickname": "The Reaper",
      "weight_class": "Men Middleweight",
      "elo_score": 1592.79
    },
    {
      "fighter_id": "32f52247c6aca92701ff1f9bcaf069fb48f02eda7edd92ffa9f620f0cdcc9941",
      "first_name": "Gegard",
      "last_name": "Mousasi",
      "nickname": null,
      "weight_class": "Men Middleweight",
      "elo_score": 1588.49
    },
    {
      "fighter_id": "a3769fccb34cab6d47b1094b43b74ec01663a0f1d6a5ceae4bb27653dc07af26",
      "first_name": "Kelvin",
      "last_name": "Gastelum",
      "nickname": null,
      "weight_class": "Men Middleweight",
      "elo_score": 1587.28
    },
    {
      "fighter_id": "4dbe1ff247a307db2fdd0bb2713751cf819c2df0c68f9bd7c1d30490f843fe81",
      "first_name": "Yoel",
      "last_name": "Romero",
      "nickname": "Soldier of God",
      "weight_class": "Men Middleweight",
      "elo_score": 1585.39
    },
    {
      "fighter_id": "1b287a28552dcb0864f1705d9474c55ddd837ad22630aa91df1542efbfb96a9b",
      "first_name": "Derek",
      "last_name": "Brunson",
      "nickname": "The One",
      "weight_class": "Men Middleweight",
      "elo_score": 1584.44
    },
    {
      "fighter_id": "4007adc3a98c0b49a8f1f95cd29593c8c9585ed455b88e9a9696a93751dddc58",
      "first_name": "Israel",
      "last_name": "Adesanya",
      "nickname": "The Last Stylebender",
      "weight_class": "Men Middleweight",
      "elo_score": 1581.43
    },
    {
      "fighter_id": "6718245e16c7fe5bb70408567d26f79d066e8233cfe32dbdd0ab500eb0ecc240",
      "first_name": "Jack",
      "last_name": "Hermansson",
      "nickname": "The Joker",
      "weight_class": "Men Middleweight",
      "elo_score": 1577.65
    },
    {
      "fighter_id": "7402dbeeef6a798fea6a1de9f425766bd0009222ff94d7408a1b6e744f5eb5ac",
      "first_name": "Krzysztof",
      "last_name": "Jotko",
      "nickname": null,
      "weight_class": "Men Middleweight",
      "elo_score": 1577.49
    }
  ],
  "Men Welterweight": [
    {
      "fighter_id": "54293263a6a27bca62acd4ec565b82105dc0fa87377551aca7c650e7b38e5663",
      "first_name": "Kamaru",
      "last_name": "Usman",
      "nickname": "The Nigerian Nightmare",
      "weight_class": "Men Welterweight",
      "elo_score": 1681.25
    },
    {
      "fighter_id": "e73113ae6b19cfa0bde2967835d55446ef8b5bc6445553f9df30e1810fe953e1",
      "first_name": "Neil",
      "last_name": "Magny",
      "nickname": "The Haitian Sensation",
      "weight_class": "Men Welterweight",
      "elo_score": 1663.86
    },
    {
      "fighter_id": "cf8e7cb7ac54ee0d47c1eece90a0f53e9a7d5b76082a2ed76607a08107f2723c",
      "first_name": "Ian Machado",
      "last_name": "Garry",
      "nickname": "The Future",
      "weight_class": "Men Welterweight",
      "elo_score": 1636.44
    },
    {
      "fighter_id": "8b499406199e05fcfa86522427f8821a591e172185652165417cd0d04fd80ee7",
      "first_name": "Randy",
      "last_name": "Brown",
      "nickname": "Rudeboy",
      "weight_class": "Men Welterweight",
      "elo_score": 1631.01
    },
    {
      "fighter_id": "2464ee76be6f5ba777af85ad2b5a79acbed861189793ba16b6ac578e33e978ca",
      "first_name": "Leon",
      "last_name": "Edwards",
      "nickname": "Rocky",
      "weight_class": "Men Welterweight",
      "elo_score": 1626.3
    },
    {
      "fighter_id": "ffe795a6b64e550ffbc1fe34ab8f89634406fa68e9a633dfa4479bc477e8823a",
      "first_name": "Belal",
      "last_name": "Muhammad",
      "nickname": "Remember the Name",
      "weight_class": "Men Welterweight",
      "elo_score": 1622.96
    },
    {
      "fighter_id": "5d51e2c80b42e1128857df29d115423690013a2bf713595764e4382fbe5e6810",
      "first_name": "Jake",
      "last_name": "Matthews",
      "nickname": "The Celtic Kid",
      "weight_class": "Men Welterweight",
      "elo_score": 1617.46
    },
    {
      "fighter_id": "e685dd8e34634225b8585f70dd96a70403b17dcb34c32fd958d8742efd62df34",
      "first_name": "Daniel",
      "last_name": "Rodriguez",
      "nickname": "D-Rod",
      "weight_class": "Men Welterweight",
      "elo_score": 1615.2
    },
    {
      "fighter_id": "bccdbfdf5050822135d5d0ca2a809b40631dd1cc774fb2b4a1f939afdec111a8",
      "first_name": "Jack Della",
      "last_name": "Maddalena",
      "nickname": null,
      "weight_class": "Men Welterweight",
      "elo_score": 1612.48
    },
    {
      "fighter_id": "61804cb2b118b638b2133371d7de2a416a77ad124aba371735da44f95aa7e892",
      "first_name": "Shavkat",
      "last_name": "Rakhmonov",
      "nickname": "Nomad",
      "weight_class": "Men Welterweight",
      "elo_score": 1606.96
    },
    {
      "fighter_id": "fb22090d1d3aae21bd281ed526e22b4f63260a3629ad96616f5128f114609a9e",
      "first_name": "Michael",
      "last_name": "Morales",
      "nickname": null,
      "weight_class": "Men Welterweight",
      "elo_score": 1601.9
    },
    {
      "fighter_id": "0bacc1d3c08aed8479541e67d41aa6761a82a8f3ad84e968316faa06648f9e68",
      "first_name": "Michael",
      "last_name": "Chiesa",
      "nickname": "Maverick",
      "weight_class": "Men Welterweight",
      "elo_score": 1600.94
    },
    {
      "fighter_id": "d105a4d041aa797685af2b9b1af35475ba003d307b7dd97d47901202217d34be",
      "first_name": "Colby",
      "last_name": "Covington",
      "nickname": "Chaos",
      "weight_class": "Men Welterweight",
      "elo_score": 1600.21
    },
    {
      "fighter_id": "7f805888b18138669ec890bb860619f9eaa9ce2d3b91ab4b3b4934a3d496fc6f",
      "first_name": "Rinat",
      "last_name": "Fakhretdinov",
      "nickname": "Gladiator",
      "weight_class": "Men Welterweight",
      "elo_score": 1599.92
    },
    {
      "fighter_id": "89730af062ed21d05f642db8dad6b85aeb34a716bd438f358eed465ae8ce6c7a",
      "first_name": "Sean",
      "last_name": "Brady",
      "nickname": null,
      "weight_class": "Men Welterweight",
      "elo_score": 1592.62
    }
  ],
  "Men Lightweight": [
    {
      "fighter_id": "b4bde5b220b7dd2b7c934951db059f842de05a0bcae9951191d44867fa8cfaba",
      "first_name": "Khabib",
      "last_name": "Nurmagomedov",
      "nickname": "The Eagle",
      "weight_class": "Men Lightweight",
      "elo_score": 1647.58
    },
    {
      "fighter_id": "17f6f9b90ca89180614b85e76885214f6162c442a7247a41c7a119e9ae5d3347",
      "first_name": "Dustin",
      "last_name": "Poirier",
      "nickname": "The Diamond",
      "weight_class": "Men Lightweight",
      "elo_score": 1632.37
    },
    {
      "fighter_id": "8f6966dbb66b16d235d5ccea6392e0e9a010b39baeaa853c6d6a6bb37d3ed217",
      "first_name": "Paddy",
      "last_name": "Pimblett",
      "nickname": "The Baddy",
      "weight_class": "Men Lightweight",
      "elo_score": 1630.55
    },
    {
      "fighter_id": "f01158c26ab841666cbd4efaf9a6dee0ec33f660f21aaecafab0ee44daf3ad30",
      "first_name": "Donald",
      "last_name": "Cerrone",
      "nickname": "Cowboy",
      "weight_class": "Men Lightweight",
      "elo_score": 1622.8
    },
    {
      "fighter_id": "bb3a73668aaffdc1f0ca256b7b2d80417a26fee30da3a04ce8a392e7e84f2f71",
      "first_name": "Beneil",
      "last_name": "Dariush",
      "nickname": null,
      "weight_class": "Men Lightweight",
      "elo_score": 1615.04
    },
    {
      "fighter_id": "16a1effa4d1ec9b7ff74aba664d56353bd8c8dfce3fc026745a0fa8fe2346b40",
      "first_name": "Gilbert",
      "last_name": "Burns",
      "nickname": "Durinho",
      "weight_class": "Men Lightweight",
      "elo_score": 1613.57
    },
    {
      "fighter_id": "a7bcfb0c7288f0248f0120548266dd3693bf9aa1fb445c2eabb7033ba76198b4",
      "first_name": "Fares",
      "last_name": "Ziam",
      "nickname": "The Smile Killer",
      "weight_class": "Men Lightweight",
      "elo_score": 1613.25
    },
    {
      "fighter_id": "ed9d04802f1f2f22c5260ffdd05e7fb967f0af3244ba0b77076afb4db93ad6e0",
      "first_name": "Grant",
      "last_name": "Dawson",
      "nickname": "KGD",
      "weight_class": "Men Lightweight",
      "elo_score": 1610.42
    },
    {
      "fighter_id": "2bb4486868649507fc792c343885e6bc73522b9c8fa08442d63ffbd2f3d22a0d",
      "first_name": "Arman",
      "last_name": "Tsarukyan",
      "nickname": "Ahalkalakets",
      "weight_class": "Men Lightweight",
      "elo_score": 1610.01
    },
    {
      "fighter_id": "7e02c75e328fe42de330a84ef19f128fd883bdb18ea13f3b90e989909cd0a088",
      "first_name": "Drakkar",
      "last_name": "Klose",
      "nickname": null,
      "weight_class": "Men Lightweight",
      "elo_score": 1606.69
    },
    {
      "fighter_id": "f34699ad028eff77eff8ff84eda435d083e2b907fa43ec89a7e25491ea47bea3",
      "first_name": "Steve",
      "last_name": "Garcia",
      "nickname": "Mean Machine",
      "weight_class": "Men Lightweight",
      "elo_score": 1594.78
    },
    {
      "fighter_id": "a9d8c85dfa55c535be709059f2cf10683759f609d05104272065c267ebc86bc7",
      "first_name": "Francisco",
      "last_name": "Trinaldo",
      "nickname": "Massaranduba",
      "weight_class": "Men Lightweight",
      "elo_score": 1590.01
    },
    {
      "fighter_id": "6789cc7c936de2aa3f31137ea099a2110497e001c968a26268fed0ba67eeeedd",
      "first_name": "Chris",
      "last_name": "Duncan",
      "nickname": "The Problem",
      "weight_class": "Men Lightweight",
      "elo_score": 1589.74
    },
    {
      "fighter_id": "9bed358ff77ab21cc6a5194b0024b9aa10f90914ca7dbfe642552297ec4b0c37",
      "first_name": "Justin",
      "last_name": "Gaethje",
      "nickname": "The Highlight",
      "weight_class": "Men Lightweight",
      "elo_score": 1586.34
    },
    {
      "fighter_id": "8cdca94716a940732603aeabf4e00abb7caa8de6b92e84d47fd67115def7b2fc",
      "first_name": "Benson",
      "last_name": "Henderson",
      "nickname": "Smooth",
      "weight_class": "Men Lightweight",
      "elo_score": 1583.52
    }
  ],
  "Men Featherweight": [
    {
      "fighter_id": "9ac6ebb1c4605a563cc0e7355d973985aa67db8ea8caeaef7db11ae70152b609",
      "first_name": "Alexander",
      "last_name": "Volkanovski",
      "nickname": "The Great",
      "weight_class": "Men Featherweight",
      "elo_score": 1673.05
    },
    {
      "fighter_id": "be8c673e32ce0e68b5e06b74ad72992817851933243d0f4b0d4848b6470cbab7",
      "first_name": "Charles",
      "last_name": "Oliveira",
      "nickname": "Do Bronxs",
      "weight_class": "Men Featherweight",
      "elo_score": 1646.51
    },
    {
      "fighter_id": "4752be4949573471dab2f599aea5a67452a806913aabfe0f072638e43d0ea8cf",
      "first_name": "Ilia",
      "last_name": "Topuria",
      "nickname": "El Matador",
      "weight_class": "Men Featherweight",
      "elo_score": 1638.02
    },
    {
      "fighter_id": "0ec0364d20611740e2e0e93b2e7b1643d400d83056919f12d33bda1a13fbfd20",
      "first_name": "Movsar",
      "last_name": "Evloev",
      "nickname": null,
      "weight_class": "Men Featherweight",
      "elo_score": 1637.47
    },
    {
      "fighter_id": "38bc29843ac7a62a587ea2192f1f0b1d4fbea6a89f47e0fd0739567e050ce88e",
      "first_name": "Lerone",
      "last_name": "Murphy",
      "nickname": "The Miracle",
      "weight_class": "Men Featherweight",
      "elo_score": 1629.86
    },
    {
      "fighter_id": "3fa37a41edc238ed1bd957d01765d0b772b09f433ae6c59e856b51c42d9cdd95",
      "first_name": "Max",
      "last_name": "Holloway",
      "nickname": "Blessed",
      "weight_class": "Men Featherweight",
      "elo_score": 1628.64
    },
    {
      "fighter_id": "d7f704ada7a617d976a7435a0145e7111d9bd409e8c20f92842a6cd073944ab0",
      "first_name": "Arnold",
      "last_name": "Allen",
      "nickname": "Almighty",
      "weight_class": "Men Featherweight",
      "elo_score": 1614.96
    },
    {
      "fighter_id": "d27d6e4b328d48b74aaccf934b761561d32755cde541b78edbe463052e39db33",
      "first_name": "Pat",
      "last_name": "Sabatini",
      "nickname": null,
      "weight_class": "Men Featherweight",
      "elo_score": 1607.31
    },
    {
      "fighter_id": "375c1e33d5059a93362c5d5b1102d5e7ca5aac8f76391510191718ebeb6d66b5",
      "first_name": "Jose",
      "last_name": "Aldo",
      "nickname": null,
      "weight_class": "Men Featherweight",
      "elo_score": 1600.81
    },
    {
      "fighter_id": "f21eb05ee7a7dc8979fcea23bee2d2239d8372a649fe6a4b5c674ac47901d452",
      "first_name": "Melquizael",
      "last_name": "Costa",
      "nickname": "The Dalmatian",
      "weight_class": "Men Featherweight",
      "elo_score": 1588.73
    },
    {
      "fighter_id": "58e24c5313e986d45598bc04ca322d2260bdc0faf59ad2fb5c86c3a001302955",
      "first_name": "Bryce",
      "last_name": "Mitchell",
      "nickname": "Thug Nasty",
      "weight_class": "Men Featherweight",
      "elo_score": 1583.04
    },
    {
      "fighter_id": "4260dcdd1109cfca0a5f6972960f6c63eb0caa76f640c0d38a1ac91b84819933",
      "first_name": "Michael",
      "last_name": "Johnson",
      "nickname": "The Menace",
      "weight_class": "Men Featherweight",
      "elo_score": 1582.33
    },
    {
      "fighter_id": "9ad6f429f48de73bf1fba80a4ec60a71e20858d17bd01860970b55c5ed5376b3",
      "first_name": "Zabit",
      "last_name": "Magomedsharipov",
      "nickname": null,
      "weight_class": "Men Featherweight",
      "elo_score": 1580.76
    },
    {
      "fighter_id": "0ca7101c4808ebcc9fbbdd1b143712838d38a56a4b22af842dc0e2994ba8558d",
      "first_name": "Nate",
      "last_name": "Mohr",
      "nickname": null,
      "weight_class": "Men Featherweight",
      "elo_score": 1580.71
    },
    {
      "fighter_id": "456c11da224449afd1c03630cc21cfc21a0924504d779fde5e346807cc86924c",
      "first_name": "Chepe",
      "last_name": "Mariscal",
      "nickname": "Machine Gun",
      "weight_class": "Men Featherweight",
      "elo_score": 1577.64
    }
  ],
  "Men Bantamweight": [
    {
      "fighter_id": "226fb9100c6784bce0f40724af78e981dad7471440c51c4579692c0ef2598e64",
      "first_name": "Sean",
      "last_name": "O'Malley",
      "nickname": "Suga",
      "weight_class": "Men Bantamweight",
      "elo_score": 1639.91
    },
    {
      "fighter_id": "30e670e523be2847eb689311ef95c7f7718beeb8d18ddcec70635559ab1047a9",
      "first_name": "Song",
      "last_name": "Yadong",
      "nickname": "Kung Fu Kid",
      "weight_class": "Men Bantamweight",
      "elo_score": 1636.7
    },
    {
      "fighter_id": "a6a855afdc4f11d2e533a2445945ff5a39b84359a231d9a48d86347364f7219d",
      "first_name": "Deiveson",
      "last_name": "Figueiredo",
      "nickname": "Deus da Guerra",
      "weight_class": "Men Bantamweight",
      "elo_score": 1622.75
    },
    {
      "fighter_id": "fd0e1a6e2e36f0136e54e52a530170a77146df889db252e16e51173472e04d97",
      "first_name": "Rob",
      "last_name": "Font",
      "nickname": null,
      "weight_class": "Men Bantamweight",
      "elo_score": 1614.89
    },
    {
      "fighter_id": "32ca80933d90b33ad44be059b8ebc72542260f84cadd5a8345a830585da52827",
      "first_name": "Montel",
      "last_name": "Jackson",
      "nickname": "Quik",
      "weight_class": "Men Bantamweight",
      "elo_score": 1606.14
    },
    {
      "fighter_id": "e2e55477379a7559c2c628f493d0f3ef58afcefc17f79e84ea09dab597a50ad2",
      "first_name": "Raoni",
      "last_name": "Barcelos",
      "nickname": null,
      "weight_class": "Men Bantamweight",
      "elo_score": 1599.32
    },
    {
      "fighter_id": "19e296b4c25059c7f5d0435014e249e71430b83fdb86dac6a54c65cc922581da",
      "first_name": "Aljamain",
      "last_name": "Sterling",
      "nickname": "Funk Master",
      "weight_class": "Men Bantamweight",
      "elo_score": 1598.31
    },
    {
      "fighter_id": "9062bcfecdf9107b5a5310063bc9727d65a8bb1ffcce16005c870d5445c39800",
      "first_name": "Petr",
      "last_name": "Yan",
      "nickname": "No Mercy",
      "weight_class": "Men Bantamweight",
      "elo_score": 1596.65
    },
    {
      "fighter_id": "de2ff2a1b6fcde2d471d3bcae04966ebe31f89fe11ade0c23dc4db0d0deb4c89",
      "first_name": "Aiemann",
      "last_name": "Zahabi",
      "nickname": null,
      "weight_class": "Men Bantamweight",
      "elo_score": 1593.93
    },
    {
      "fighter_id": "6aeee4f0ef69dd590cf0a0190a215b18aa0898bdb703b6949ce5c839a3bd9783",
      "first_name": "Merab",
      "last_name": "Dvalishvili",
      "nickname": "The Machine",
      "weight_class": "Men Bantamweight",
      "elo_score": 1593.7
    },
    {
      "fighter_id": "9326420c4050be32405a5e1e3e34c66131cef1f8e179c9e83ac1bc9bf04a41f8",
      "first_name": "TJ",
      "last_name": "Dillashaw",
      "nickname": null,
      "weight_class": "Men Bantamweight",
      "elo_score": 1589.87
    },
    {
      "fighter_id": "8212098cf80a0ce99c9063bc457b76f31e81c9b0e69b0add3cd3df668aa944b3",
      "first_name": "Chris",
      "last_name": "Gutierrez",
      "nickname": "El Guapo",
      "weight_class": "Men Bantamweight",
      "elo_score": 1589.76
    },
    {
      "fighter_id": "fbcb498daffb1c7009c2cf1bf223d664853552163b7bb8fd98e7151e164c1743",
      "first_name": "Farid",
      "last_name": "Basharat",
      "nickname": "Ferocious",
      "weight_class": "Men Bantamweight",
      "elo_score": 1588.75
    },
    {
      "fighter_id": "121e71471822d2eee6e8ee53bfbf88d2b3a28ca90ea263319d9721e03e28e8cb",
      "first_name": "Umar",
      "last_name": "Nurmagomedov",
      "nickname": null,
      "weight_class": "Men Bantamweight",
      "elo_score": 1587.59
    },
    {
      "fighter_id": "e8a8e28826708a812393e206b9fff6dae6db8581276abda05c1212a17214bb25",
      "first_name": "Vinicius",
      "last_name": "Oliveira",
      "nickname": "LokDog",
      "weight_class": "Men Bantamweight",
      "elo_score": 1582.15
    }
  ],
  "Men Flyweight": [
    {
      "fighter_id": "5037bd2c161b65c91fcf2c8c3d0c31dabed6f39793c1ca57c18efbcd5e534935",
      "first_name": "Demetrious",
      "last_name": "Johnson",
      "nickname": "Mighty Mouse",
      "weight_class": "Men Flyweight",
      "elo_score": 1656.6
    },
    {
      "fighter_id": "d259a4198ee13a05dd6dc0b85be9709a66e1afaf6f5c1cfd88b5c352fe1585d0",
      "first_name": "Joseph",
      "last_name": "Benavidez",
      "nickname": null,
      "weight_class": "Men Flyweight",
      "elo_score": 1628.21
    },
    {
      "fighter_id": "a8773701d02be26a62d177c2afaf1043de807b72872a64ef832339f6abb6a452",
      "first_name": "Alexandre",
      "last_name": "Pantoja",
      "nickname": "The Cannibal",
      "weight_class": "Men Flyweight",
      "elo_score": 1625.55
    },
    {
      "fighter_id": "e867c4ee060b4fdb9f32de114235107b1248021c9a72acd4ebe82e0a9084c52a",
      "first_name": "Joshua",
      "last_name": "Van",
      "nickname": "The Fearless",
      "weight_class": "Men Flyweight",
      "elo_score": 1623.48
    },
    {
      "fighter_id": "a1b9b47f051a794bf1a9556dec8f8af71e948378d0c49c9fcf855954847c3643",
      "first_name": "Kyoji",
      "last_name": "Horiguchi",
      "nickname": null,
      "weight_class": "Men Flyweight",
      "elo_score": 1594.91
    },
    {
      "fighter_id": "d6b826d38a125edfd5ce021f2f67ed57ad7540883da53428229b1ae9a94cf839",
      "first_name": "Muhammad",
      "last_name": "Mokaev",
      "nickname": "The Punisher",
      "weight_class": "Men Flyweight",
      "elo_score": 1593.65
    },
    {
      "fighter_id": "4549974220a2474e2f8f761136d785c38607c6a27ef5330b22119a412bcf1e37",
      "first_name": "Tatsuro",
      "last_name": "Taira",
      "nickname": "The Best",
      "weight_class": "Men Flyweight",
      "elo_score": 1583.91
    },
    {
      "fighter_id": "fc808720fcf53cf5d49cf6e68dfb2d1af76024e87546cb05c0789b83c620382b",
      "first_name": "Brandon",
      "last_name": "Royval",
      "nickname": "Raw Dawg",
      "weight_class": "Men Flyweight",
      "elo_score": 1583.35
    },
    {
      "fighter_id": "262da2440ab171c24a21ab3092d8529e0e89007a2e9e5b3578757b51bba3ab3d",
      "first_name": "Charles",
      "last_name": "Johnson",
      "nickname": "InnerG",
      "weight_class": "Men Flyweight",
      "elo_score": 1568.24
    },
    {
      "fighter_id": "bf473fe920e366dabdfabf66c72bc00da3f11fbf3eaa93650bc8f1c0faf4bce0",
      "first_name": "John",
      "last_name": "Lineker",
      "nickname": "Hands of Stone",
      "weight_class": "Men Flyweight",
      "elo_score": 1567.2
    },
    {
      "fighter_id": "4f43e120a1b161473e8fa2ee4d3e9387973cc8b10242c985536de1ee3c3413b4",
      "first_name": "Andre",
      "last_name": "Lima",
      "nickname": "Mascote",
      "weight_class": "Men Flyweight",
      "elo_score": 1564.37
    },
    {
      "fighter_id": "fd0463e7f4bb2f3271f22693a4415b7f9686cd5936589885c76c0c3da60ab27f",
      "first_name": "Asu",
      "last_name": "Almabayev",
      "nickname": "Zulfikar",
      "weight_class": "Men Flyweight",
      "elo_score": 1561.93
    },
    {
      "fighter_id": "485ce6710c9680ed4b36676ac851738f487272db51110784353525f22706b1a9",
      "first_name": "Jesus",
      "last_name": "Aguilar",
      "nickname": null,
      "weight_class": "Men Flyweight",
      "elo_score": 1555.44
    },
    {
      "fighter_id": "dd53f07cb20b7b04776f6e161d7872d27055bc1b0f0db9fb29e374524db05413",
      "first_name": "Brandon",
      "last_name": "Moreno",
      "nickname": "The Assassin Baby",
      "weight_class": "Men Flyweight",
      "elo_score": 1554.54
    },
    {
      "fighter_id": "de279f831e9be5f4de6527f81ba0e87419799aff5d4de74284ecf023410fe59e",
      "first_name": "Tagir",
      "last_name": "Ulanbekov",
      "nickname": null,
      "weight_class": "Men Flyweight",
      "elo_score": 1553.55
    }
  ],
  "Women Bantamweight": [
    {
      "fighter_id": "810b0e140f60b6a9305eefa52103e88325a98c87c17982119d73d9354d174774",
      "first_name": "Amanda",
      "last_name": "Nunes",
      "nickname": "The Lioness",
      "weight_class": "Women Bantamweight",
      "elo_score": 1672.99
    },
    {
      "fighter_id": "6fbd67fd189df58d772f4da81fd01644e4d9c67428097cfbb41ee5374650ab0a",
      "first_name": "Valentina",
      "last_name": "Shevchenko",
      "nickname": "Bullet",
      "weight_class": "Women Bantamweight",
      "elo_score": 1616.28
    },
    {
      "fighter_id": "5d0975a0e2b246df965a90080c40622a144066c1fdc9e86628e188b99124b1d0",
      "first_name": "Raquel",
      "last_name": "Pennington",
      "nickname": "Rocky",
      "weight_class": "Women Bantamweight",
      "elo_score": 1600.73
    },
    {
      "fighter_id": "ce7eabd699da08c6808bfc4ec131fe0da08dc22a6bd079589511f66f8d65f66a",
      "first_name": "Julianna",
      "last_name": "Pena",
      "nickname": "The Venezuelan Vixen",
      "weight_class": "Women Bantamweight",
      "elo_score": 1583.94
    },
    {
      "fighter_id": "79c83e4b915a250dc9db2cfe826f06a341b3d4953e1471286a0f39040454fb17",
      "first_name": "Jacqueline",
      "last_name": "Cavalcanti",
      "nickname": null,
      "weight_class": "Women Bantamweight",
      "elo_score": 1580.97
    },
    {
      "fighter_id": "855c7fb441d48cf0305c7b2f5ebb144c429151e51d64a79001906e090d705786",
      "first_name": "Ketlen",
      "last_name": "Vieira",
      "nickname": "Fenomeno",
      "weight_class": "Women Bantamweight",
      "elo_score": 1580.95
    },
    {
      "fighter_id": "8cd1375f5a8dbbbbc0a45f360b588da844921831a07a305c0859d28660b63a99",
      "first_name": "Irene",
      "last_name": "Aldana",
      "nickname": null,
      "weight_class": "Women Bantamweight",
      "elo_score": 1564.82
    },
    {
      "fighter_id": "576690b77ed915b78c9f5f01e5e8278987d2ad1d26c7a9b35b6422f18a13d328",
      "first_name": "Ailin",
      "last_name": "Perez",
      "nickname": "Fiona",
      "weight_class": "Women Bantamweight",
      "elo_score": 1563.51
    },
    {
      "fighter_id": "c22808120c44a757c6cdffd0a15dfebe529d13baad810133e8d4ab849378d7ce",
      "first_name": "Germaine de",
      "last_name": "Randamie",
      "nickname": "The Iron Lady",
      "weight_class": "Women Bantamweight",
      "elo_score": 1562.83
    },
    {
      "fighter_id": "d0bb84f0724a8cfa1f04cd46fa664ecf4cd73ef828b8670f42484a9311e1bd3a",
      "first_name": "Ronda",
      "last_name": "Rousey",
      "nickname": "Rowdy",
      "weight_class": "Women Bantamweight",
      "elo_score": 1553.27
    },
    {
      "fighter_id": "63b22a191dd18faad965ac0e96bb3ca71e6a33f8daa7eda0c577625c52e6800f",
      "first_name": "Karol",
      "last_name": "Rosa",
      "nickname": null,
      "weight_class": "Women Bantamweight",
      "elo_score": 1547.57
    },
    {
      "fighter_id": "7ea92c289bfd381baa05f67ae672b110c379b605f45b7529d8cace486719e80c",
      "first_name": "Leslie",
      "last_name": "Smith",
      "nickname": "The Peacemaker",
      "weight_class": "Women Bantamweight",
      "elo_score": 1533.52
    },
    {
      "fighter_id": "344f84fde85e97d784a64f12a81c8ddf548c9fb98424024103567786350af1cc",
      "first_name": "Sara",
      "last_name": "McMann",
      "nickname": null,
      "weight_class": "Women Bantamweight",
      "elo_score": 1532.1
    },
    {
      "fighter_id": "acab5f994b04fe9b487aaa335d41cb3fd8cb510226e55994c894255c6983545a",
      "first_name": "Kayla",
      "last_name": "Harrison",
      "nickname": null,
      "weight_class": "Women Bantamweight",
      "elo_score": 1529.84
    },
    {
      "fighter_id": "33d6824e749649fe1cfc391e8ed77f4e90eabd7387f985a3b685fd908a47682b",
      "first_name": "Viviane",
      "last_name": "Araujo",
      "nickname": "Vivi",
      "weight_class": "Women Bantamweight",
      "elo_score": 1528.04
    }
  ],
  "Women Flyweight": [
    {
      "fighter_id": "f85d97c93a314ae0d78e5b7a87bc98396357368b1db63e4929e57f21f640a88e",
      "first_name": "Manon",
      "last_name": "Fiorot",
      "nickname": "The Beast",
      "weight_class": "Women Flyweight",
      "elo_score": 1623.22
    },
    {
      "fighter_id": "b60cb5cdeb608eee5bcdb4d4dbf3cf6efdd3fbca4292979d27b8077dbbabb9d2",
      "first_name": "Natalia",
      "last_name": "Silva",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1613.1
    },
    {
      "fighter_id": "1c194ae6bc40a9bb547bfb7254129dcd4f5606cea6b080233172ef6bff74a8a8",
      "first_name": "Maycee",
      "last_name": "Barber",
      "nickname": "The Future",
      "weight_class": "Women Flyweight",
      "elo_score": 1606.22
    },
    {
      "fighter_id": "22cc49c3a0748922e975f9f0777d2407c0d4add03c6d205035ce2abe030cf536",
      "first_name": "Erin",
      "last_name": "Blanchfield",
      "nickname": "Cold Blooded",
      "weight_class": "Women Flyweight",
      "elo_score": 1606.2
    },
    {
      "fighter_id": "78737a2c2d4a57cbaf5d24d51ea3d654ae347dab1b4d796c8e864dd61bd79e76",
      "first_name": "Jasmine",
      "last_name": "Jasudavicius",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1589.79
    },
    {
      "fighter_id": "b3e8c6bdc7398da7729841f676bac97a0a0d14fb9e74a153e92af227bd22298f",
      "first_name": "Alexa",
      "last_name": "Grasso",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1583.48
    },
    {
      "fighter_id": "8f9cb571d589c74f82fbe2d84f7a6818bb9044fd07d6ce9ab4200dbc70cedc50",
      "first_name": "Tracy",
      "last_name": "Cortez",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1567.71
    },
    {
      "fighter_id": "1b03b8bec3e7048d694276fafe44cc81e4ab723bbf9287f6ab07489e69966d6d",
      "first_name": "Luana",
      "last_name": "Santos",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1560.37
    },
    {
      "fighter_id": "2886a1701cc07444d241b05a6eba727250ee1735f748d6e1e613b1534477e22b",
      "first_name": "Casey",
      "last_name": "O'Neill",
      "nickname": "King",
      "weight_class": "Women Flyweight",
      "elo_score": 1553.23
    },
    {
      "fighter_id": "e11c717f2555d125c3dcaf738efab704b50ca5d34d468643070cd2ddc82fb2b5",
      "first_name": "Lauren",
      "last_name": "Murphy",
      "nickname": "Lucky",
      "weight_class": "Women Flyweight",
      "elo_score": 1552.5
    },
    {
      "fighter_id": "6b39ada11a7ddc4bc7a5d964ff6a8d863b791deb6fa38529a603d987d93fb9af",
      "first_name": "Miranda",
      "last_name": "Maverick",
      "nickname": "Fear The",
      "weight_class": "Women Flyweight",
      "elo_score": 1552.01
    },
    {
      "fighter_id": "58324388a790c0ac48050c5c83c6f7069b160f0764b9252b1574693167c25f7e",
      "first_name": "Karine",
      "last_name": "Silva",
      "nickname": "Killer",
      "weight_class": "Women Flyweight",
      "elo_score": 1550.41
    },
    {
      "fighter_id": "b833001a8abb160dfcad319a21b0cb16340bb01d47d9bd7506400ffd0e5c11e6",
      "first_name": "Montana De La",
      "last_name": "Rosa",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1545.95
    },
    {
      "fighter_id": "1bc43750a9a618ebbb79f73c9a88cfc392ecebb046cd8065b70e4dc1e04ed577",
      "first_name": "Katlyn",
      "last_name": "Cerminara",
      "nickname": "Blonde Fighter",
      "weight_class": "Women Flyweight",
      "elo_score": 1545.69
    },
    {
      "fighter_id": "8ef5f47144e4c34881fc5f239b9cda97c3d23d36ac4a6df191aed8e75b9d6068",
      "first_name": "Jamey-Lyn",
      "last_name": "Horth",
      "nickname": null,
      "weight_class": "Women Flyweight",
      "elo_score": 1544.09
    }
  ],
  "Women Strawweight": [
    {
      "fighter_id": "2c7e46e24edbaaa8801b65b59873ae2826066c9d1cb9c52a9693b3355fcba357",
      "first_name": "Zhang",
      "last_name": "Weili",
      "nickname": "Magnum",
      "weight_class": "Women Strawweight",
      "elo_score": 1617.2
    },
    {
      "fighter_id": "686c37c5c342bd0b425de86c51435c599ad24e07b8f48b472a908001afa4157c",
      "first_name": "Tatiana",
      "last_name": "Suarez",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1587.13
    },
    {
      "fighter_id": "b3cf3f402b6d3bfe530e7a919acd26aae9fb24a7a49437f612b2fb596ad181b8",
      "first_name": "Rose",
      "last_name": "Namajunas",
      "nickname": "Thug",
      "weight_class": "Women Strawweight",
      "elo_score": 1580.41
    },
    {
      "fighter_id": "255b1c8f8aaf8a00f1f9be6603990f7a1b7021bed225ba6ed5c9e40f8dcc8690",
      "first_name": "Yan",
      "last_name": "Xiaonan",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1580.16
    },
    {
      "fighter_id": "13caa2efd3c76f74f8191560c35468554bce089025043f1bc43223b23b328804",
      "first_name": "Tabatha",
      "last_name": "Ricci",
      "nickname": "Baby Shark",
      "weight_class": "Women Strawweight",
      "elo_score": 1579.34
    },
    {
      "fighter_id": "0b7d66b5a8bf5edf38ace6eb35036b05cead7024ba5a1b09f3706d0b92bd0602",
      "first_name": "Joanna",
      "last_name": "Jedrzejczyk",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1572.68
    },
    {
      "fighter_id": "441c9eff69f0a29a8bfdc2e56b59cc6d7320526a31d1256871a90dd9073ded4d",
      "first_name": "Denise",
      "last_name": "Gomes",
      "nickname": "Dee",
      "weight_class": "Women Strawweight",
      "elo_score": 1566.24
    },
    {
      "fighter_id": "42ace27f425da68d48d81589423850202de60377e586ef196bdf47322cf827a8",
      "first_name": "Amanda",
      "last_name": "Lemos",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1563.95
    },
    {
      "fighter_id": "b1e81e141a6af4f889ee1c5d60b9428590f9f308735d8eb857d77455a34bd317",
      "first_name": "Mackenzie",
      "last_name": "Dern",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1563.63
    },
    {
      "fighter_id": "5a5e63a7a4bd08fe75d23b4c7d6aa5db6beeb897df09162c3fb0a1073b520451",
      "first_name": "Gillian",
      "last_name": "Robertson",
      "nickname": "The Savage",
      "weight_class": "Women Strawweight",
      "elo_score": 1563.22
    },
    {
      "fighter_id": "1bcc83b7cc96b346eaa4ea13fa2ae8b207eb2071a49b0086dc25c8f64ffff060",
      "first_name": "Loopy",
      "last_name": "Godinez",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1558.6
    },
    {
      "fighter_id": "dfd8407c45bbe2a8dd9622d461b6d1a7ed65ad1ca5b3ffb5683c8b40d5971034",
      "first_name": "Carla",
      "last_name": "Esparza",
      "nickname": "Cookie Monster",
      "weight_class": "Women Strawweight",
      "elo_score": 1557.59
    },
    {
      "fighter_id": "c63e7389a445112b53ecbc41a779dfb5e9a4052324602d98bffdbe6dda462f0e",
      "first_name": "Sam",
      "last_name": "Hughes",
      "nickname": "Sampage",
      "weight_class": "Women Strawweight",
      "elo_score": 1552.51
    },
    {
      "fighter_id": "66ce23d09fb5b9eb9671bf3d5fcb0c5d021876b5d8f08aa359b81be6e340a597",
      "first_name": "Talita",
      "last_name": "Alencar",
      "nickname": "Problem Child",
      "weight_class": "Women Strawweight",
      "elo_score": 1544
    },
    {
      "fighter_id": "e436062a27607b87b848fed4d5d71c680c6606f7aa6f32891152f5959b475eb6",
      "first_name": "Jaqueline",
      "last_name": "Amorim",
      "nickname": null,
      "weight_class": "Women Strawweight",
      "elo_score": 1543.03
    }
  ],
  "Pound For Pound": [
    {
      "fighter_id": "fe51b692675a3e80222398009be4dcb1dff61dd3c13ed8d98810d6501f092cca",
      "first_name": "Jon",
      "last_name": "Jones",
      "nickname": "Bones",
      "elo_score": 1727.51
    },
    {
      "fighter_id": "54293263a6a27bca62acd4ec565b82105dc0fa87377551aca7c650e7b38e5663",
      "first_name": "Kamaru",
      "last_name": "Usman",
      "nickname": "The Nigerian Nightmare",
      "elo_score": 1681.25
    },
    {
      "fighter_id": "f20e051c6ceb64202c08e3a34d097fec1159d0333d8e469c094225b1049e4351",
      "first_name": "Islam",
      "last_name": "Makhachev",
      "nickname": null,
      "elo_score": 1674.98
    },
    {
      "fighter_id": "351ebdfac02d54f154d4b15d3388d8823b55e4ffd00143043fd4a33477eb48d4",
      "first_name": "Dricus Du",
      "last_name": "Plessis",
      "nickname": "Stillknocks",
      "elo_score": 1673.16
    },
    {
      "fighter_id": "9ac6ebb1c4605a563cc0e7355d973985aa67db8ea8caeaef7db11ae70152b609",
      "first_name": "Alexander",
      "last_name": "Volkanovski",
      "nickname": "The Great",
      "elo_score": 1673.05
    },
    {
      "fighter_id": "810b0e140f60b6a9305eefa52103e88325a98c87c17982119d73d9354d174774",
      "first_name": "Amanda",
      "last_name": "Nunes",
      "nickname": "The Lioness",
      "elo_score": 1672.99
    },
    {
      "fighter_id": "e73113ae6b19cfa0bde2967835d55446ef8b5bc6445553f9df30e1810fe953e1",
      "first_name": "Neil",
      "last_name": "Magny",
      "nickname": "The Haitian Sensation",
      "elo_score": 1663.86
    },
    {
      "fighter_id": "5037bd2c161b65c91fcf2c8c3d0c31dabed6f39793c1ca57c18efbcd5e534935",
      "first_name": "Demetrious",
      "last_name": "Johnson",
      "nickname": "Mighty Mouse",
      "elo_score": 1656.6
    },
    {
      "fighter_id": "bc84498719596eaa12af26aaa8260b1fb6b7fa02c520b7cae0370ea38a82fbc3",
      "first_name": "Alexander",
      "last_name": "Volkov",
      "nickname": "Drago",
      "elo_score": 1649.94
    },
    {
      "fighter_id": "b4bde5b220b7dd2b7c934951db059f842de05a0bcae9951191d44867fa8cfaba",
      "first_name": "Khabib",
      "last_name": "Nurmagomedov",
      "nickname": "The Eagle",
      "elo_score": 1647.58
    },
    {
      "fighter_id": "4a52a7853453d569b57d850e366c198f4fd7e2629f366b8ad98c753f6087d47e",
      "first_name": "Alex",
      "last_name": "Pereira",
      "nickname": "Poatan",
      "elo_score": 1647.06
    },
    {
      "fighter_id": "be8c673e32ce0e68b5e06b74ad72992817851933243d0f4b0d4848b6470cbab7",
      "first_name": "Charles",
      "last_name": "Oliveira",
      "nickname": "Do Bronxs",
      "elo_score": 1646.51
    },
    {
      "fighter_id": "226fb9100c6784bce0f40724af78e981dad7471440c51c4579692c0ef2598e64",
      "first_name": "Sean",
      "last_name": "O'Malley",
      "nickname": "Suga",
      "elo_score": 1639.91
    },
    {
      "fighter_id": "4752be4949573471dab2f599aea5a67452a806913aabfe0f072638e43d0ea8cf",
      "first_name": "Ilia",
      "last_name": "Topuria",
      "nickname": "El Matador",
      "elo_score": 1638.02
    },
    {
      "fighter_id": "0ec0364d20611740e2e0e93b2e7b1643d400d83056919f12d33bda1a13fbfd20",
      "first_name": "Movsar",
      "last_name": "Evloev",
      "nickname": null,
      "elo_score": 1637.47
    }
  ]
}

const dummyResponseType = mapRankingsToFighterType(dummyResponse)





const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fighterResponseInfo, setFighterResponseInfo] = useState<NormalizedRankings | null>(null);
  
  const [selectedClass, setSelectedClass] = useState<WeightClass>('Pound For Pound');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] 
  );

  useEffect(() => {
    let isMounted = true; // prevents state update after unmount
    setLoading(true);

    const formattedDate = formatDate(selectedDate)
    console.log(formattedDate)
    apiGet<RawRankings>(`http://127.0.0.1:8000/monthly-rankings/${formattedDate}`)
      .then(rawData => {
        if (!isMounted) return;

        // Map the API response to your normalized type
        const cleanedData = mapRankingsToFighterType(rawData);

        setFighterResponseInfo(cleanedData); 
        console.log("Mapped RankingsData:", cleanedData);

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load rankings:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);


  // Use the API data instead of the dummy data
  const weightClasses = fighterResponseInfo
    ? (Object.keys(fighterResponseInfo) as WeightClass[])
    : [];

  const fighters = fighterResponseInfo?.[selectedClass] || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50">      
      <Navbar
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        weightClasses={weightClasses}
      />
      
      
      
      {/* <RankingsList weightClass={selectedClass} fighters={fighters} /> */}
      {loading ? (
        <ThreeDot variant="pulsate" color="#e11515" size="medium" text="" textColor="" />
      ) : (
        <RankingsList
          weightClass={selectedClass}
          fighters={fighters}
        />
      )}



      {/* <FighterInfo
        image="https://a.espncdn.com/i/headshots/mma/players/full/2335639.png"
        firstname="Jon"
        lastname="Jones"
        nickname="Bones"
        birthday="July 19, 1987"
        weightClass="Heavyweight"
        height="6'4\"
        reach="84.5\"
        record="27-1-0"
        koWins={10}
        subWins={7}
        decisionWins={10}
        eloHistory={[1500, 1520, 1550, 1580, 1600]} // example data
      /> */}
    </div>
  );
};

export default App;