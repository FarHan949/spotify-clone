console.log('lets go')

//  global Variable
let currentSong = new Audio();

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
const playMusic= (audio) =>{
    // let track = new Audio("/song/" + audio)
    currentSong.src = "/song/" + audio
    currentSong.play()
}



async function main(){

    // get the list of the all song 
    let songs = await getSong()
    // console.log(songs)


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

           console.log(e.querySelector(".info").firstElementChild.innerText)
           playMusic(e.querySelector(".info").firstElementChild.innerText)
       })
   })
   
}

main()