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
        video = url.searchParams.get('v');
        if(video.length !== 11){
            return;
        }
    }

    video = 'https://youtube.com/embed/' + video + '?vq=medium';

    if(core_elements['frame']){
        core_elements['frame'].src = video;

    }else{
        core_elements['viewer'].innerHTML = '<iframe allowfullscreen frameborder=0 height=' + (globalThis.innerHeight - 4) + ' id=frame referrerpolicy=no-referrer src="' + video + '" width=100%></iframe>';
        core_elements['frame'] = document.getElementById('frame');
    }

    core_escape();
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
    if(core_elements['frame']){
        frame.height = globalThis.innerHeight - 4;
    }
}
