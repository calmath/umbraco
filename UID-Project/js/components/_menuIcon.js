/*exported MenuIcon */
/**
 * @file _menuIcon.js
 * @author Netcel
 *
 * @classdesc Hamburger menu functionality
 */
class MenuIcon {
	/**
	 * Set up the menu icon and navigation drawer.
	 * @constructs
	 * @param {HTMLelmenet} elemMenu - Html element for menu icon
	 * @param {HTMLelmenet} elemNav - Html element for navigation drawer containing links
	 */
	constructor(elemMenu, elemNav){
		
		this.open = false;
		this.body = document.documentElement;
		this.menuButton = elemMenu;
		this.menuNav = elemNav;
		this.links = this.menuNav.getElementsByTagName("a");
		
		this.menuButton.addEventListener("click", this.toggleMenu.bind(this), false);
		this.menuButton.disabled = false;
		
		this.linkFirst = this.menuButton;
		this.linkLast = this.links[this.links.length - 1];
		
		window.addEventListener("keydown", this.tabControl.bind(this), false);
	}
	/**
	 * Event handler for when user interacts with the menu icon
	 * @param {Object} evt - Click event
	 */
	toggleMenu(evt){
		
		this.open = !this.open;
		
		if(this.open){
			this.body.classList.add("menuOpen");
		}else{
			this.body.classList.remove("menuOpen");
		}
		
	}
	/**
	 * Event handler for when user tabs through the open
	 * navigation menu. If the menu is open the tabbing
	 * will loop around the open menu links.
	 * @param {Object} evt - Keydown event
	 */
	tabControl(evt){
		
		if(this.open){
			if(evt.keyCode === 27){
				
				this.linkFirst.focus();
				this.toggleMenu();
				
			}else{
				if(evt.code === "Tab" || evt.keyCode === 9){


					if(evt.shiftKey){

						if(document.activeElement === this.linkFirst){
							this.linkLast.focus();
							evt.preventDefault();
						}

					}else{

						if(document.activeElement === this.linkLast){
							this.linkFirst.focus();
							evt.preventDefault();
						}

					}
				}
			}
		}
	}
}