'use strict';

function load_video(){
    if(!core_menu_open){
        return;
    }
    core_storage_save();

    let video = core_storage_data.video;
    if(!video){
        return;
    }

    if(video.length === 34){
        video = 'videoseries?list=' + video;

    }else if(video.length !== 11){
        const url = new URL(video);
        if(!URL.canParse(url)){
            return;
        }
        const playlist = url.searchParams.get('list');
        if(playlist){
            video = 'videoseries?list=' + playlist;

        }else{
            video = url.hostname === 'youtu.be'
              ? url.pathname.substring(1)
              : (url.pathname.includes('/shorts/')
                ? url.pathname.substring(8)
                : url.searchParams.get('v'));
            if(video.length !== 11){
                return;
            }
            const time = url.searchParams.get('t');
            if(time){
                video += '?start=' + time.substring(0, time.length - 1);
            }
        }
        if(url.searchParams.has('pp') || url.searchParams.has('si')){
            url.searchParams.delete('pp');
            url.searchParams.delete('si');
            core_elements.video.value = url.toString();
            core_storage_save();
        }
    }

    if(core_storage_data.quality.length){
        video += (video.length === 11 ? '?' : '&') + 'rel=0&vq=' + core_storage_data.quality;
    }

    resize();
    core_elements.frame.src = 'https://youtube.com/embed/' + video;
    core_escape();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(core_elements.frame.contentDocument === null){
                event.preventDefault();
            }
        },
      },
      'events': {
        'load': {
          'onclick': load_video,
        },
        'unload': {
          'onclick': function(){
              if(globalThis.confirm('Unload video?')){
                  core_elements.frame.src = '';
              }
          },
        },
      },
      'info': '<input id=video style="width:370px" type=text><br>'
        + '<a href=../guides/repos/youtubeviewer-htm.htm target=_blank>View Docs</a> <button id=unload type=button>Unload</button><select id=quality>'
        + '<option value="">Default'
        + '<option value=hd1080>1080p'
        + '<option value=hd720>720p'
        + '<option value=large>480p'
        + '<option value=medium>360p'
        + '<option value=small>240p'
        + '<option value=tiny>144p'
        + '</select><button class=medium id=load type=button>Load</button>',
      'keybinds': {
        'Enter': {
          'down': load_video,
        },
      },
      'menu': true,
      'menu_block_events': false,
      'owner': 'honzi',
      'storage': {
        'quality': '',
        'video': '',
      },
      'title': 'YouTubeViewer.htm',
      'ui_elements': [
        'frame',
      ],
    });

    document.body.style.padding = 0;
    globalThis.onresize = resize;
    resize();
}

function resize(){
    core_elements.frame.height = globalThis.innerHeight - 4;
}
