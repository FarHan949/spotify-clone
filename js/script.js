//  global Variable
let currentSong = new Audio();
let songs;


// get song function 
async function getSong(){
    let a = await fetch("http://127.0.0.1:5500/song/")
    let response = await a.text()
    // console.log(response)

    let div = document.createElement('div')
    div.innerHTML = response
    let anchor  = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if(element.href.endsWith('.mp3')){
               songs.push(element.href.split("/song/")[1])
        }
    }
    return songs
}




       // play audio function 
const playMusic= (audio, pause=false) =>{
    // let track = new Audio("/song/" + audio)
    currentSong.src = "/song/" + audio
    if(!pause){

        currentSong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(audio)
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
}



function secondsToMinutes(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros if needed
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted string
    return formattedMinutes + ':' + formattedSeconds;
}



// main logic here 
async function main(){

    // get the list of the all song 
     songs = await getSong()
    // console.log(songs)

    playMusic(songs[0], true)
    // show all the song in the playlist 
    let songUl = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +  `
                        <li><img class="invert" src="svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20"," ")}</div>
                            <div>Farhan</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="svg/play.svg" alt="">
                        </div></li>`
    }


    // Add event listener to each song
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e =>{
       e.addEventListener('click', element=>{
        //    console.log(e.querySelector(".info").firstElementChild.innerText)
           playMusic(e.querySelector(".info").firstElementChild.innerText)
       })
   })

   
// Add event listener to play song  
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "svg/play.svg"
        }
    })  
      
    // Add event listener to  previous and next
    previous.addEventListener('click', ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //    console.log('clicked next',index)
       if((index-1) >= 0){

           playMusic(songs[index-1])
       }
    })


    next.addEventListener('click', () => {

        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log('clicked next', index);
        if ((index + 1)  < songs.length) {
            playMusic(songs[index + 1]); // Play the first song if index is not found or if it's the last song
        }
    });
    
    


//   Time update event 
      currentSong.addEventListener("timeupdate", ()=>{

          if(!isNaN(currentSong.duration)){
            
            document.querySelector(".songtime").innerHTML = `
            ${secondsToMinutes(parseInt(currentSong.currentTime))} /
            ${secondsToMinutes(parseInt(currentSong.duration))}`
            document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
          }
      })



    //   add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener('click', (e)=>{
       let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
       document.querySelector(".circle").style.left = percent + "%"
    
       currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    //  add event listener for hamburger and open song library
    document.querySelector(".hamburger").addEventListener('click', ()=>{
    document.querySelector(".left").style.left = "0"
    })
    //  add event listener for close || close the library 
    document.querySelector(".close").addEventListener('click', ()=>{
    document.querySelector(".left").style.left = "-130%"
    document.querySelector(".left").style.transition = "all 1s"
    })
     
    // add event listener to volume 
    document.querySelector(".rang").getElementsByTagName("input")[0].addEventListener('change', (e)=>{
        // console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value)/100
        // if (currentSong.volume > 0){
        //     document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("svg/mute.svg", "volume.svg")
        // }
    }) 
    
}

main()