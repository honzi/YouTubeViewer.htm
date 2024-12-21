'use strict';

function load_video(){
    core_storage_save();

    let video = core_storage_data['video'];
    if(!video){
        return;
    }

    if(video.length !== 11){
        const url = new URL(video);
        if(!URL.canParse(url)){
            return;
        }
        video = url.hostname === 'youtu.be'
          ? url.pathname.substr(1)
          : (url.pathname.includes('/shorts/')
            ? url.pathname.substr(8)
            : url.searchParams.get('v'));
        if(video.length !== 11){
            return;
        }
        const time = url.searchParams.get('t');
        if(time){
            video += '?start=' + time.substr(0, time.length - 1);
        }
        if(url.searchParams.has('pp') || url.searchParams.has('si')){
            url.searchParams.delete('pp');
            url.searchParams.delete('si');
            core_elements['video'].value = url.toString();
            core_storage_save();
        }
    }

    if(core_storage_data['quality'].length){
        video += (video.length === 11 ? '?' : '&') + 'rel=0&vq=' + core_storage_data['quality'];
    }
    video = 'https://youtube.com/embed/' + video;

    if(core_elements['frame']){
        core_elements['frame'].src = video;

    }else{
        document.getElementById('viewer').innerHTML = '<iframe allowfullscreen frameborder=0 height=' + (globalThis.innerHeight - 4) + ' id=frame referrerpolicy=no-referrer src="' + video + '" width=100%></iframe>';
        core_elements['frame'] = document.getElementById('frame');
    }

    core_escape();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(core_elements['frame']){
                return 'The video will be unloaded if you leave.';
            }
        },
      },
      'events': {
        'load-video': {
          'onclick': load_video,
        },
      },
      'info': '<input id=video style="width:370px" type=text><br>'
        + '<select id=quality>'
        + '<option value="">Default'
        + '<option value=hd1080>1080p'
        + '<option value=hd720>720p'
        + '<option value=large>480p'
        + '<option value=medium>360p'
        + '<option value=small>240p'
        + '<option value=tiny>144p'
        + '</select><button id=load-video type=button>Load Video</button>',
      'keybinds': {
        'Enter': {
          'todo': function(event){
              if(core_menu_open){
                  load_video();
              }
          },
        },
      },
      'menu': true,
      'menu-block-events': false,
      'owner': 'honzi',
      'storage': {
        'quality': '',
        'video': '',
      },
      'title': 'YouTubeViewer.htm',
    });

    document.body.style.padding = 0;
    globalThis.onresize = function(){
        if(core_elements['frame']){
            core_elements['frame'].height = globalThis.innerHeight - 4;
        }
    };
}
