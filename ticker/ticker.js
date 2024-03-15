const eachSlideSec = 6;
let currentIndex = 0;
let timer;
let afterTransitionEndDoThis;
let isAnimating = false;

function isOverflow(element) {
    var overflowX = element.offsetWidth < element.scrollWidth ,
        overflowY = element.offsetHeight < element.scrollHeight;
    return (overflowX || overflowY);
}

function removeItem(idx) {
    const items = document.querySelectorAll('#items li');
    const itemToRemove = items[idx];
    const currentItem = items[currentIndex];

    const doDelete = () => {
        itemToRemove.remove();
    };

    if ( currentItem === itemToRemove || isAnimating ) {
        afterTransitionEndDoThis = doDelete;
    } else {
        doDelete();
    }
}

function enableMarquee(li) {
    const liWidth = li.offsetWidth;
    const article = li.querySelector('article');
    const articleWidth = article.offsetWidth;
    const startEndWait = (eachSlideSec / 2) * 1000;
    const duration = (articleWidth / liWidth) * 5 * 1000;
    const finalTranslateX = -(articleWidth - liWidth);
    setTimeout(() => {
        article.classList.add('marquee');
        article.style.animationDuration = `${duration / 1000}s`;
        article.style.setProperty('--final-translateX' , `${finalTranslateX}px`);
    } , startEndWait);

    const nextSlideInMsec = duration + startEndWait * 2;
    timer = setTimeout(showNextItem , nextSlideInMsec);
}

function showNextItem() {
    const items = document.querySelectorAll('#items li');
    if ( items.length === 0 ) {
        clearInterval(interval);
        return;
    }

    if ( ! items[currentIndex] ) {
        currentIndex = 0;
    }
    const currentItem = items[currentIndex];
    let nextIndex = (currentIndex + 1) % items.length;
    if ( ! items[nextIndex] ) {
        nextIndex = 0;
    }
    const nextItem = items[nextIndex];
    const disappearAnimation = 'flip-out';
    const appearAnimation = 'slide-in';

    console.log({currentIndex , currentItem , nextIndex , nextItem});
    if ( currentItem ) {
        const currentArticle = currentItem.querySelector('article');
        currentArticle.style.animationDuration = '';
        const currentItemClassList = currentArticle.classList;
        // start fade out animation
        isAnimating = true;
        currentItemClassList.add(disappearAnimation);

        setTimeout(() => {
            // fade out animation end
            currentArticle.style.removeProperty('--final-translateX');
            currentItemClassList.remove('active' , disappearAnimation , 'marquee');
            currentItemClassList.add('inactive');
            isAnimating = false;

            // misc things to do after existing item fades out
            currentItem.style.display = 'none';
            nextItem.style.display = 'flex';
            // start next item slide in
            const nextItemClassList = nextItem.querySelector('article').classList;
            isAnimating = true;
            nextItemClassList.add(appearAnimation);
            setTimeout(() => {
                // item side-in completes
                nextItemClassList.add('active');
                nextItemClassList.remove('inactive' , appearAnimation);
                isAnimating = false;

                if ( typeof afterTransitionEndDoThis === 'function' ) {
                    afterTransitionEndDoThis();
                    afterTransitionEndDoThis = null;
                }
                if ( isOverflow(nextItem) ) {
                    enableMarquee(nextItem);
                } else {
                    // start timer for next slide
                    timer = setTimeout(showNextItem , eachSlideSec * 1000);
                }
            } , 1000); // Slide-in animation
        } , 1000); // Duration of fade-out animation
    }
    currentIndex = nextIndex;
}

document.addEventListener('DOMContentLoaded' , function () {
    // Show the first item immediately
    showNextItem();

// Example: dynamically adding and removing items
    setTimeout(function () {
        const ul = document.getElementById('items');
        const newItem = document.createElement('li');
        newItem.innerHTML = '<article><b>1:07</b>東京</article>';
        ul.appendChild(newItem);
    } , 6 * 1000); // Add new item after 6 seconds

// Example: dynamically removing items after 10 seconds
    setTimeout(() => {
        removeItem(2); // Remove item at index 2 after 10 seconds
    } , 10 * 1000);
});
