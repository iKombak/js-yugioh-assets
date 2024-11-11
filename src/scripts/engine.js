const state={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1:"player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button:document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData=[
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Drak Magician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img:`${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function getRandomCardId(){
    const randomIndex= Math.floor(Math.random()*cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImg(IdCard,fieldSide){
    const cardImg= document.createElement("img");
    cardImg.setAttribute("height","70px");
    cardImg.setAttribute("src","./src/assets/icons/card-back.png");
    cardImg.setAttribute("data-id",IdCard);
    cardImg.classList.add("card")

    if(fieldSide===state.playerSides.player1){
        cardImg.addEventListener("click",() => {
            setCardsField(cardImg.getAttribute("data-id"));
        });
        cardImg.addEventListener("mouseover",() => {
                drawSelectedCard(IdCard);
            });
    }
    return cardImg;
}

async function setCardsField(IdCard){

    await removeAllCards();

    let computerCardId= await getRandomCardId();

    await hiddenCardDetails();

    await ShowHiddenCardFieldsimages(true);

    state.fieldCards.player.src= cardData[IdCard].img;
    state.fieldCards.computer.src= cardData[computerCardId].img;
    
    let duelResults = await chekDuelResults(IdCard,computerCardId);
     await updateScore();
     await drawButton(duelResults);
}


async function ShowHiddenCardFieldsimages(value){
    if(value==="true"){
        state.fieldCards.player.style.display="block";
        state.fieldCards.computer.style.display="block";
    }

    if(value==="false"){
        state.fieldCards.player.style.display="none";
        state.fieldCards.computer.style.display="none";
    }
}


async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText ="";
    state.cardSprites.type.innerText ="";
}


async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display="none";

    state.fieldCards.player.style.display="none";
    state.fieldCards.computer.style.display="none";
    init();
}


async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display="block";
}

async function chekDuelResults(playerCardId,computerCardId){
    let duelresults ="EMPATE";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelresults = "GANASTE";
        await playAudio(duelresults);
        state.score.playerScore++;
    }
    if(playerCard.LoseOf.includes(computerCardId)){
        duelresults = "PERDISTE";
        await playAudio(duelresults);
        state.score.computerScore++;
    }
    return duelresults
    }



async function removeAllCards(){
    let{computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}


async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText ="Attribute: "+ cardData[index].type;
}


 
async function drawCards(cardNumbers,fieldSide){
    for(let i=0;i<cardNumbers;i++){
        const randomIdCard= await getRandomCardId();
        const cardImg= await createCardImg(randomIdCard,fieldSide);

        document.getElementById(fieldSide).appendChild(cardImg);
    }
}

async function playAudio(status){
    const audio= new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch (error) {
        
    }
}

function init(){

    ShowHiddenCardFieldsimages(false);
    
    drawCards(5,state.playerSides.player1);
    drawCards(5,state.playerSides.computer);

    const bgm= document.getElementById("bgm");
    bgm.play();
}

init();