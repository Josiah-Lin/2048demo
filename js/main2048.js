var board = new Array();
var score = 0;
var hasConflicted = new Array();//ÿ���ƶ������ײһ�Σ����ڼ�¼�Ƿ�����ײ

//���������ͽ�����λ��
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
    prepareForMobile();
    newGame();
});

function prepareForMobile(){
    if(documentWidth > 500){//��ʱ���������ƶ��棬�����̶�ֵ���൱�ڱ�Ϊ��ҳ��
        gridContainerWidth = 330;
        cellSpace = 10;
        cellSideLength = 70;
    }

    $('#grid-container').css('width',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02 * gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02 * cellSideLength);
}

function newGame(){
    //��ʼ�����̸�
    init();
    //���������������������
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i = 0;i < 4;i++)
    for(var j = 0;j < 4;j++){
        var gridCell = $("#grid-cell"+"-"+i+"-"+j);
        gridCell.css('top',getPosTop(i,j));
        gridCell.css('left',getPosLeft(i,j));
    }

    //��board��Ϊ��ά���飬�洢��Ҫ��ʾ������
    for(var i = 0;i < 4;i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();//Ҳ�����Ϊ��ά����
        for(var j = 0;j < 4;j++){
            board[i][j] = 0;//��ʼÿ�����Ӷ���ʼ��Ϊ0
            hasConflicted[i][j] = false;//����ʼ��Ϊfalse
        }
    }
    score = 0;//������ʼ��

    updateBoardView();
}

//�������ã�����board������ֵ��Ҫ��ʾ��Ԫ�ؽ��в���
function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i < 4;i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            //ȷ�����ֵ�λ��
            if (board[i][j] == 0) {//����Ϊ0�Ļ�����ʾ
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);//λ�÷�����С������м�
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                //�ı����ֵ���ɫ�ͱ���ɫ
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                //��ʾ���ֵ�ֵ
                theNumberCell.text(board[i][j]);

            }
            hasConflicted[i][j] = false;//ÿ�θ�������ҲҪ�����ʼ��Ϊfalse
        }
    }
    updateScore(score);

    $('.number-cell').css('line-height',cellSideLength + 'px');
    $('.number-cell').css('font-size',0.6 * cellSideLength + 'px');

}

function generateOneNumber(){
    //��trueʱ����ǰ���̸��޿ռ��ˣ�����false
    if(nospace(board))
        return false;
    //���һ��λ��
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));

   /*while(true){//������ɵ�λ���������֣�����ԣ����������ɵ�λ�����������֣���Ҫ��������
       if(board[randx][randy] == 0)
       break;

        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
   }*/

    //�������ѭ���Ļ������ڲ������λ�ÿ��ܻ�Ч�ʺ���,��Ϊ����ֻʣһ���ո�ʱ��ѭ������Ҫ���ܳ�ʱ����������������Ǹ�λ��
    //���������ѭ��50�Σ���ѭ���껹û�ҵ������ֵ����λ�õĻ������ֶ��ҵ�һ�����λ��
    for(var i = 0;i < 50;i++){
        if(board[randx][randy] == 0) {
            break;
        }else{
            randx = parseInt(Math.floor(Math.random()*4));
            randy = parseInt(Math.floor(Math.random()*4));
        }
    }
    if(i == 50){//δ�ҵ������ֵ����λ�ã��ֶ�����һ��λ��
        for(var i = 0;i < 4;i++){
            for(var j = 0;j < 4;j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //���һ�����֣�50%������������2,50%��������4
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //�������λ������ʾ����
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}


//���������Ӧ����Ϸѭ��
$(document).keyup(function(event){

    switch (event.keyCode){
        case 37://left
            event.preventDefault();//�赲����ʱ��Ĭ��Ч�������ù�����������
            if(moveLeft()){//moveLeft()�����и�����ֵ�����ƶ�ʱ����true,���������ֶ������ʱ����false,�����в���
                setTimeout("generateOneNumber()",210);//����һ������
                setTimeout("isgameover()",300);//�ж���Ϸ�Ƿ����
            }
            break;
        case 38://up
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);//ͬ��Ҫ�ö����ӳ�һ�ᷢ��
                setTimeout("isgameover()",300);
            }
            break;
        case 39://right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40://down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);;
            }
            break;
        default :break;
    }
});

//��Ӵ������¼�����
document.addEventListener('touchstart',function(event){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
    event.preventDefault();
});
document.addEventListener('touchend',function(event){
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    //�����������ж������ĸ����򻬶���
    var deltax = endX - startX;
    var deltay = endY - startY;

    //����һ����ֵ������ֻ�ǵ��ʱ�������Ļ���
    if(Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth){
        return;
    }

    //��x���򻬶���
    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //���һ��ģ�x������
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }else{
            //���󻬵�
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    //��y���򻬶���
    else{
        if(deltay > 0){
            //���»��ģ�y�����������ֻ���Ļ�У�y���������µ�
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);;
            }
        }else{
            //���ϻ�����
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});
function moveLeft(){
    if(!canMoveLeft(board)) {//�����ǰ�����ƶ�������false
        return false;
    }
    //moveLeft
    for(var i = 0; i < 4;i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {//�Ե�ǰ�н���ѭ��
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {//ǰ�������ֲ���֮ǰ���ϰ�
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {//��ǰ���������������ϰ�����û��������ײ
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);//���·���

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //���¶��������ݽ���һ��ˢ��
    setTimeout("updateBoardView()",200);//forѭ�����еķǳ��죬������û���ü�ִ�о��Ѿ�ˢ���ˣ�����Ҫ������ʱ����
    return true;
}

function moveRight(){
    if(!canMoveRight(board)) {//�����ǰ�����ƶ�������false
        return false;
    }

    //moveRight
    for(var i = 0; i < 4;i++) {
        for (var j = 2; j > -1; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {//ǰ�������ֲ���֮ǰ���ϰ�
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {//��ǰ���������������ϰ�
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);//���·���

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //���¶��������ݽ���һ��ˢ��
    setTimeout("updateBoardView()",200);//forѭ�����еķǳ��죬������û���ü�ִ�о��Ѿ�ˢ���ˣ�����Ҫ������ʱ����
    return true;
}

function moveUp(){
    if(!canMoveUp(board)) {//�����ǰ�����ƶ�������false
        return false;
    }

    //moveUp
    for(var j = 0; j < 4;j++) {//��ѭ���У���ѭ����
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {//ǰ�������ֲ���֮ǰ���ϰ�
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {//��ǰ���������������ϰ�
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);//���·���

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    //���¶��������ݽ���һ��ˢ��
    setTimeout("updateBoardView()",200);//forѭ�����еķǳ��죬������û���ü�ִ�о��Ѿ�ˢ���ˣ�����Ҫ������ʱ����
    return true;
}

function moveDown(){
    if(!canMoveDown(board)) {//�����ǰ�����ƶ�������false
        return false;
    }

    //moveDown
    for(var j = 0; j < 4;j++) {//��ѭ���У���ѭ����
        for (var i = 2; i > -1; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {//ǰ�������ֲ���֮ǰ���ϰ�
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {//��ǰ���������������ϰ�
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);//���·���

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    //���¶��������ݽ���һ��ˢ��
    setTimeout("updateBoardView()",200);//forѭ�����еķǳ��죬������û���ü�ִ�о��Ѿ�ˢ���ˣ�����Ҫ������ʱ����
    return true;
}

function isgameover(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert('Game Over!' + '\n' + "You score is" + " "+ score);
}

