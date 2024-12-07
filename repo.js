'use strict';

function load_video(){
    core_storage_save();

    let url = core_storage_data['video'];
    if(!url){
        return;
    }

    let video = '';
    if(url.length === 11){
        video = url;

    }else{
        url = new URL(url);
        if(!URL.canParse(url)){
            return;
        }
        video = url.searchParams.get('v');
        if(video.length !== 11){
            return;
        }
    }

    core_escape();
    core_elements['viewer'].innerHTML = '<iframe frameborder=0 id=frame height=' + (globalThis.innerHeight - 4) + ' id=frame src="https://youtube.com/embed/' + video + '?vq=medium" width=100%></iframe>';
}

function repo_init(){
    core_repo_init({
      'events': {
        'load-video': {
          'onclick': load_video,
        },
      },
      'info': '<input id=video type=text><button id=load-video type=button>Load Video</button>',
      'menu': true,
      'owner': 'honzi',
      'storage': {
        'video': '',
      },
      'title': 'YouTubeViewer.htm',
      'ui-elements': [
        'viewer',
      ],
    });

    document.body.style.paddingTop = 0;
    globalThis.onresize = resize_viewer;
}

function resize_viewer(){
    const frame = document.getElementById('frame');
    if(!frame){
        return;
    }
    frame.height = globalThis.innerHeight - 4;
}
