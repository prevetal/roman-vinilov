// Mob. viewport
const initAdaptiveViewport = () => {
	const viewportMeta = document.querySelector('meta[name="viewport"]')
	if (!viewportMeta) return

	const mqDeviceNarrow = window.matchMedia('(max-device-width: 374px)')

	const apply = () => {
		mqDeviceNarrow.matches
			? viewportMeta.setAttribute('content', 'width=375, user-scalable=no')
			: viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1')
	}

	apply()

	mqDeviceNarrow.addEventListener('change', apply)
}


// Height of the fixed/sticky header in --header_height (used in scroll-margin-top)
const initHeaderHeight = () => {
	const headers = document.querySelectorAll('header .bottom, .mob_header')

	const update = () => {
		let height = 0

		headers.forEach(el => {
			const position = getComputedStyle(el).position,
				rect = el.getBoundingClientRect()

			if ((position === 'fixed' || position === 'sticky') && rect.right > 0 && rect.left < window.innerWidth) {
				height = Math.max(height, rect.height)
			}
		})

		document.documentElement.style.setProperty('--header_height', height + 'px')
	}

	update()

	const resizeObserver = new ResizeObserver(update),
		mutationObserver = new MutationObserver(update)

	headers.forEach(el => {
		resizeObserver.observe(el)
		mutationObserver.observe(el, { attributes: true, attributeFilter: ['class'] })
	})

	window.addEventListener('resize', update)
}


const getCssVar = (el, name) => {
	const val = getComputedStyle(el).getPropertyValue(name).trim(),
		num = parseFloat(val)

	return isNaN(num) ? val : num
}


const is_touch_device = () => window.matchMedia('(hover: none)').matches



// Animations (analog of jQuery slideDown/slideUp/fadeIn/fadeOut)
// A new call interrupts the current animation and continues from the current state.
// Each function returns a Promise: true - finished, false - interrupted
const runningAnimations = new WeakMap()

const BOX_ZERO = {
	height: '0px',
	paddingTop: '0px',
	paddingBottom: '0px',
	marginTop: '0px',
	marginBottom: '0px'
}


const isHidden = el => getComputedStyle(el).display === 'none'


const showElement = el => {
	el.style.display = ''

	if (isHidden(el)) el.style.display = 'block'
}


const getBoxState = el => {
	const style = getComputedStyle(el)

	return {
		height: el.offsetHeight + 'px',
		paddingTop: style.paddingTop,
		paddingBottom: style.paddingBottom,
		marginTop: style.marginTop,
		marginBottom: style.marginBottom
	}
}


const stopAnimation = el => {
	runningAnimations.get(el)?.animation.cancel()
	runningAnimations.delete(el)
}


const runAnimation = (el, keyframes, duration, show) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) duration = 0

	const animation = el.animate(keyframes, { duration, easing: 'ease' })

	runningAnimations.set(el, { animation, show })

	return animation.finished.then(() => {
		runningAnimations.delete(el)

		if (!show) el.style.display = 'none'

		return true
	}, () => false)
}


const isShowing = el => {
	const running = runningAnimations.get(el)

	return running ? running.show : !isHidden(el)
}


const slideDown = (el, duration = 300) => {
	const hidden = isHidden(el),
		from = hidden ? BOX_ZERO : getBoxState(el)

	stopAnimation(el)

	if (hidden) showElement(el)

	const to = getBoxState(el)

	return runAnimation(el, [
		{ ...from, overflow: 'hidden', boxSizing: 'border-box' },
		{ ...to, overflow: 'hidden', boxSizing: 'border-box' }
	], duration, true)
}


const slideUp = (el, duration = 300) => {
	if (isHidden(el)) return Promise.resolve(true)

	const from = getBoxState(el)

	stopAnimation(el)

	// Keep the element visible during the animation, even if CSS hides it by a class
	el.style.display = getComputedStyle(el).display

	return runAnimation(el, [
		{ ...from, overflow: 'hidden', boxSizing: 'border-box' },
		{ ...BOX_ZERO, overflow: 'hidden', boxSizing: 'border-box' }
	], duration, false)
}


const slideToggle = (el, duration = 300) => isShowing(el)
	? slideUp(el, duration)
	: slideDown(el, duration)


const fadeIn = (el, duration = 300) => {
	const hidden = isHidden(el),
		from = hidden ? 0 : getComputedStyle(el).opacity

	stopAnimation(el)

	if (hidden) showElement(el)

	const to = getComputedStyle(el).opacity

	return runAnimation(el, [{ opacity: from }, { opacity: to }], duration, true)
}


const fadeOut = (el, duration = 300) => {
	if (isHidden(el)) return Promise.resolve(true)

	const from = getComputedStyle(el).opacity

	stopAnimation(el)

	el.style.display = getComputedStyle(el).display

	return runAnimation(el, [{ opacity: from }, { opacity: 0 }], duration, false)
}


const fadeToggle = (el, duration = 300) => isShowing(el)
	? fadeOut(el, duration)
	: fadeIn(el, duration)



// Tabs: activates the button and its content within the same level
const openTab = btn => {
	const container = btn.closest('.tabs_container'),
		level = btn.dataset.level,
		contentId = btn.getAttribute('aria-controls')

	// Only the active tab is in the Tab order, the others - by arrows
	container.querySelectorAll(`.tabs .btn[data-level="${level}"]`).forEach(el => {
		el.classList.toggle('active', el === btn)
		el.setAttribute('aria-selected', el === btn)
		el.tabIndex = el === btn ? 0 : -1
	})

	container.querySelectorAll(`.tab_content.${level}`).forEach(el => el.classList.toggle('active', el.id === contentId))
}


// Opens the tabs with the element from the link hash and scrolls to it.
// The hash can be a tab (page.html#tab2), a nested tab or any anchor inside a tab - all parent tabs are opened
const openTabFromHash = () => {
	const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null

	let panel = target?.closest('.tab_content')

	if (!panel) return

	while (panel) {
		const btn = document.querySelector(`.tabs .btn[aria-controls="${CSS.escape(panel.id)}"]`)

		if (btn) openTab(btn)

		panel = panel.parentElement.closest('.tab_content')
	}

	target.scrollIntoView()
}
