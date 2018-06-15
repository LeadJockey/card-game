(function(doc){
  'use strict';
  console.log('initialized broadcast chat server!');
  const randomNames = ['그루트', '아이언맨', '헐크', '토르', '호크아이', '블랙위도우', '블랙팬서', '닥더 스트레인지', '타노스'];
  const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
  const socket = io();

  const $msg = $('#userMsg');
  const $list = $('.list_chat');
  const $form = $('form');

  $form.onsubmit = function(){
    const msg = {
      name:randomName,
      msg:`${$msg.value}`
    };
    socket.emit('to-server-msg', msg);
    $msg.value = '';
    return false;
  };

  socket.on('to-client-msg', function(msg){
    const li = doc.createElement('li');
    li.innerHTML = `<span class="txt_name">${msg.name}</span><span class="txt_msg">${msg.msg}</span>`;
    $list.append(li);
    li.scrollIntoView(true);
  });

  function $(target){
    return doc.querySelector(target);
  }

})(document);
