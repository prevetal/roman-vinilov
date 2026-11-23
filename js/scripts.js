// Mob. viewport
initAdaptiveViewport()


// Swiper accessibility messages
const swiperA11y = {
	prevSlideMessage: 'Предыдущий слайд',
	nextSlideMessage: 'Следующий слайд',
	firstSlideMessage: 'Это первый слайд',
	lastSlideMessage: 'Это последний слайд',
	paginationBulletMessage: 'Перейти к слайду {{index}}'
}


document.addEventListener('DOMContentLoaded', function() {
	// Fixed header menu on scroll (only >= 1024px, below the header is a side menu)
	const headerBottom = document.querySelector('header .bottom')

	if (headerBottom) {
		const bottomWrap = document.createElement('div'),
			mqDesktop = window.matchMedia('(min-width: 1024px)')

		bottomWrap.className = 'bottom_wrap'
		headerBottom.before(bottomWrap)
		bottomWrap.append(headerBottom)

		// The wrapper keeps the place of the menu so that the content does not jump
		const setWrapHeight = () => {
			if (!headerBottom.classList.contains('fixed')) {
				bottomWrap.style.height = mqDesktop.matches ? headerBottom.offsetHeight + 'px' : ''
			}
		}

		// The menu is fixed when its place has gone above the screen
		const toggleFixed = () => headerBottom.classList.toggle('fixed', mqDesktop.matches && bottomWrap.getBoundingClientRect().top < 0)

		setWrapHeight()
		toggleFixed()

		new ResizeObserver(setWrapHeight).observe(headerBottom)

		window.addEventListener('scroll', toggleFixed, { passive: true })

		mqDesktop.addEventListener('change', () => {
			headerBottom.classList.remove('fixed')

			setWrapHeight()
			toggleFixed()
		})
	}


	// Header height for anchors
	initHeaderHeight()


	// Education images slider
	const educationImages = document.querySelector('.education .images')

	if (educationImages) {
		new Swiper(educationImages, {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(educationImages, '--spaceBetween'),
			slidesPerView: getCssVar(educationImages, '--slidesPerView'),
			a11y: swiperA11y,
			pagination: {
				el: educationImages.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			}
		})
	}


	// Diplomas slider
	const diplomas = document.querySelector('.education .diplomas')

	if (diplomas) {
		const diplomasSlider = diplomas.querySelector('.swiper')

		new Swiper(diplomasSlider, {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(diplomasSlider, '--spaceBetween'),
			slidesPerView: getCssVar(diplomasSlider, '--slidesPerView'),
			a11y: swiperA11y,
			navigation: {
				nextEl: diplomas.querySelector('.swiper-button-next'),
				prevEl: diplomas.querySelector('.swiper-button-prev')
			},
			pagination: {
				el: diplomas.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			}
		})
	}


	// Reviews slider
	const reviewsSlider = document.querySelector('.reviews .swiper')

	if (reviewsSlider) {
		new Swiper(reviewsSlider, {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(reviewsSlider, '--spaceBetween'),
			slidesPerView: getCssVar(reviewsSlider, '--slidesPerView'),
			a11y: swiperA11y,
			scrollbar: {
				el: reviewsSlider.querySelector('.swiper-scrollbar'),
				draggable: true
			}
		})
	}


	// Video reviews slider
	const videoReviews = document.querySelector('.video_reviews .videos')

	if (videoReviews) {
		const videoReviewsSlider = videoReviews.querySelector('.swiper')

		new Swiper(videoReviewsSlider, {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(videoReviewsSlider, '--spaceBetween'),
			slidesPerView: getCssVar(videoReviewsSlider, '--slidesPerView'),
			a11y: swiperA11y,
			navigation: {
				nextEl: videoReviews.querySelector('.swiper-button-next'),
				prevEl: videoReviews.querySelector('.swiper-button-prev')
			},
			pagination: {
				el: videoReviews.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			}
		})
	}


	// Fresh videos slider
	const freshVideosSlider = document.querySelector('.fresh_videos .swiper')

	if (freshVideosSlider) {
		new Swiper(freshVideosSlider, {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: getCssVar(freshVideosSlider, '--spaceBetween'),
			slidesPerView: getCssVar(freshVideosSlider, '--slidesPerView'),
			a11y: swiperA11y,
			pagination: {
				el: freshVideosSlider.querySelector('.swiper-pagination'),
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			}
		})
	}


	// World map: tooltip with the flag and the number of students
	const worldMap = document.querySelector('.world_map .map')

	if (worldMap) {
		const tooltip = worldMap.querySelector('.map_tooltip'),
			pluralRules = new Intl.PluralRules('ru'),
			words = { one: 'ученик', few: 'ученика', many: 'учеников', other: 'ученика' }

		worldMap.addEventListener('mouseover', e => {
			const country = e.target.closest('.colored')

			if (!country) return

			const students = Number(country.dataset.students)

			tooltip.innerHTML = `
				<img src="https://flagcdn.com/16x12/${country.dataset.country.toLowerCase()}.png" alt="" width="16" height="12" class="flag">
				<span><b>${students}</b> ${words[pluralRules.select(students)]}</span>`

			tooltip.classList.add('show')
		})

		worldMap.addEventListener('mousemove', e => {
			tooltip.style.top = `${e.clientY + 24}px`
			tooltip.style.left = `${e.clientX + 12}px`
		})

		worldMap.addEventListener('mouseout', e => {
			if (e.target.closest('.colored')) {
				tooltip.classList.remove('show')
			}
		})
	}


	// Tabs
	document.addEventListener('click', e => {
		const btn = e.target.closest('.tabs .btn')

		if (btn && !btn.classList.contains('active')) {
			openTab(btn)
		}
	})

	// Keyboard: ← → - the previous/next tab of the same level, Home/End - the first/last
	document.addEventListener('keydown', e => {
		const btn = e.target.closest('.tabs .btn')

		if (!btn || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return

		const btns = [...btn.parentElement.querySelectorAll(`:scope > .btn[data-level="${btn.dataset.level}"]`)],
			index = btns.indexOf(btn),
			next = {
				ArrowLeft: btns[(index - 1 + btns.length) % btns.length],
				ArrowRight: btns[(index + 1) % btns.length],
				Home: btns[0],
				End: btns[btns.length - 1]
			}[e.key]

		e.preventDefault()

		next.focus()
		openTab(next)
	})

	openTabFromHash()

	window.addEventListener('hashchange', openTabFromHash)


	// Dialog
	document.addEventListener('click', e => {
		const openBtn = e.target.closest('[data-open-modal]')

		if (openBtn) {
			e.preventDefault()

			document.getElementById(openBtn.dataset.openModal)?.showModal()
		}


		const closeBtn = e.target.closest('[data-close-modal]')

		if (closeBtn) {
			closeBtn.closest('dialog')?.close()
		}


		// Click outside the modal content
		const modal = e.target.closest('.modal')

		if (modal && !e.target.closest('.inner')) {
			modal.close()
		}
	})


	// Fancybox
	Fancybox.bind('[data-fancybox]', {
		l10n: Fancybox.l10n.ru_RU
	})


	// Fancybox - zoom images
	Fancybox.bind('.fancy_img', {
		l10n: Fancybox.l10n.ru_RU,
		zoomEffect: false,
		Carousel: {
			Zoomable: {
				Panzoom: {
					maxScale: 1
				}
			},
			Thumbs: {
				showOnStart: false
			}
		}
	})


	// Mob. menu (on <= 1023px the header turns into a side panel)
	const mobMenu = document.querySelector('header'),
		mobMenuBtn = document.querySelector('.mob_header .mob_menu_btn'),
		overlay = document.querySelector('.overlay')

	const toggleMobMenu = (show = !mobMenu.classList.contains('show')) => {
		mobMenu.classList.toggle('show', show)
		overlay?.classList.toggle('show', show)
		mobMenuBtn?.classList.toggle('active', show)
		document.body.classList.toggle('lock', show)
	}

	if (mobMenu) {
		document.querySelectorAll('.mob_header .mob_menu_btn, header .close_btn, .overlay').forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				toggleMobMenu()
			})
		})

		// Close after the click on the menu link
		mobMenu.querySelectorAll('.menu a').forEach(link => link.addEventListener('click', () => toggleMobMenu(false)))

		// Close when switching to the desktop
		window.matchMedia('(min-width: 1024px)').addEventListener('change', e => {
			if (e.matches) toggleMobMenu(false)
		})
	}


	// Phone input mask
	new Maska.MaskInput('input[type=tel]', {
		mask: '+7 (###) ###-##-##'
	})
})
