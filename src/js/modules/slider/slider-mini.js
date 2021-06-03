import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor(container, next, prev, activeClass, animate, autoplay, paused) {
        super(container, next, prev, activeClass, animate, autoplay, paused);
    }

    decorizeSlide() {
        this.slides.forEach(slide => {
            slide.classList.remove(this.activeClass);
            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        });

        if (!this.slides[0].closest('button')) {
            this.slides[0].classList.add(this.activeClass);
        }

        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide() {
        if (this.slides[1].tagName == 'BUTTON' && this.slides[2].tagName == 'BUTTON') {
            this.container.appendChild(this.slides[0]);
            this.container.appendChild(this.slides[1]);
            this.container.appendChild(this.slides[2]);
            this.decorizeSlide();
        } else if (this.slides[1].tagName == 'BUTTON') {
            this.container.appendChild(this.slides[0]);
            this.container.appendChild(this.slides[1]);
            this.decorizeSlide();
        } else {
            this.container.appendChild(this.slides[0]);
            this.decorizeSlide();
        }
    }

    bindTrigger() {
        this.next.forEach(btn => {
            btn.addEventListener('click', () => this.nextSlide());

            btn.addEventListener('mouseenter', () => {
                clearInterval(this.paused);
            });
    
            btn.addEventListener('mouseleave', () => {
                if (this.autoplay) {
                    this.activatAnimation();
                }
            });
        });

        this.prev.forEach(btn => {
            btn.addEventListener('click', () => {

                for (let i = this.slides.length - 1; i > 0; i--) {
                    if (this.slides[i].nodeName !== 'BUTTON') {
                        let active = this.slides[i];
                        this.container.insertBefore(active, this.slides[0]);
                        this.decorizeSlide();
                        break;
                    }
                }
            });

            btn.addEventListener('mouseenter', () => {
                clearInterval(this.paused);
            });
    
            btn.addEventListener('mouseleave', () => {
                if (this.autoplay) {
                    this.activatAnimation();
                }
            });
        });

        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.paused);
        });

        this.container.addEventListener('mouseleave', () => {
            if (this.autoplay) {
                this.activatAnimation();
            }
        });
    }

    activatAnimation() {
        this.paused = setInterval(() => this.nextSlide(), 5000);
    }

    init() {
        try {
            this.container.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                overflow: hidden;
                align-items: flex-start;
            `;

            this.bindTrigger();
            this.decorizeSlide();

            if (this.autoplay) {
                this.activatAnimation();
            } 
        } catch (e) {} 
    }
}