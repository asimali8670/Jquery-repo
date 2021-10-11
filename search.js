$(document).ready(function () {
	// Array to store all contacts
	let contactsArr = [];

	let code = localStorage.getItem('code');
	
	let contactID = 0;
	// Counter for incrementing ID's
	
	if(code == 'login'){

	$('.hide').removeClass('hide');

	// Constructor for contact objects
	function Contact(firstName, lastName, email, phone, city) {
		this._id = contactID += 1;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.city = city;
		contactsArr.push(this);
		$(this.toHTML()).hide().appendTo("#contacts-list").slideDown(300) ;
		$(this.toHTML()).hide().appendTo(".home-list").slideDown(300) ;
		console.log(`Contact added (id ${this.id}): ${this.name}`);
	};

	// Some getters, setters and a methods for contact objects
	Contact.prototype = {
		constructor: Contact,
		set(id) {
			console.log(`ID is generated on input and may not be changed`)
		},
		get id() {
			return this._id;
		},
		set firstName(firstName) {
			this._firstName = firstName;
		},
		get firstName() {
			return this._firstName;
		},
		set lastName(lastName) {
			this._lastName = lastName;
		},
		get lastName() {
			return this._lastName;
		},
		get name() {
			return this._firstName + " " + this._lastName;
		},
		set email(emailaddress) {
			this._email = emailaddress;
		},
		get email() {
			return this._email;
		},
		get emailURL() {
			return `<a href="mailto:${this.email}" title="Send mail to ${this.name}">${this.email}</a>`;
		},
		set phone(phone) {
			this._phone = phone;
		},
		get phone() {
			return this._phone
		},
        set city(city) {
			this._city = city;
		},
		get city() {
			return this._city
		},
		toHTML() {
			
			const renderCell = (content, cssClass = "") => `<div id="" class="table-cell ${cssClass}"><div>${content}</div></div>`;
			const deleteContact = `<span title="Delete contact" class="delete-contact fa fa-trash fa-sm"></span>`;
			const editContact = `<span title="Edit contact" class="edit-contact editable fa fa-edit fa-sm"></span>`;
			return `<div id="contact-${this.id}" class="contact-${this.id} table-row mt-1 mb-1">` +
				renderCell(this.id, "contact-id text-center") +
				renderCell(this.firstName, "first-name editable-cell") +
				renderCell(this.lastName, "last-name editable-cell") +
				renderCell(this.emailURL, "email editable-cell") +
				renderCell(this.phone, "phone editable-cell") +
                renderCell(this.city, "city editable-cell") +
                renderCell(editContact + deleteContact, "text-right contact-actions") + `</div>`;
		},
		toForm() {
			const renderCell = (content, cssClass = "") => `<div id="" class="table-cell ${cssClass}">${content}</div>`;
			const input = (value, type = "text", extraAttr = "") => `<input type="${type}" class="" value="${value}" ${extraAttr} required>`;
			const submit = `<button type="submit" class="form-control save-contact-changes fa fa-save btn btn-success" title="Save changes"></button>`;
			const cancel = `<div class="cancel-edit-contact mt-1 text-center" title="Cancel changes"><i class="fa fa-times fa-sm mr-1"></i>cancel</div>`;
			return '<form class="form-edit-contact table-row mt-1 mb-1">' +
				renderCell(`<input type="text" class="contact-id text-center" value="${this.id}" disabled>`) +
				renderCell(input(this.firstName), "first-name") +
				renderCell(input(this.lastName), "last-name") +
				renderCell(input(this.email, "email"), "email") +
				renderCell(input(this.phone, "tel" , `pattern="^+?[0-9\-]{6,13}"`), "phone") + // RegEx pattern errors !! ==> investigate !!
				renderCell(input(this.city, "city"), "city") +
                renderCell(submit + cancel, "text-right contact-actions") +
				`</form>`;
		},
		toCSV(cellDelimiter = ",", rowDelimiter = ";", wrapInQuotes = 1) {
			const x = cellDelimiter;
			const y = rowDelimiter;
			const q = value => wrapInQuotes === 1 ? '"' + value + '"' : value;
			return q(this.id) + x + q(this.firstName) + x + q(this.lastName) + x + q(this.email) + x + q(this.phone) + x + q(this.city) + y + "\n";
		}
	};




	/***********************/
	/*** RENDER CONTACTS ***/
	/***********************/


	function $renderContacts(arr = contactsArr.slice()) {
			const html = arr.reduce((list, contact) => list + contact.toHTML(), ''); // BUG if initial value is not set. Why ??
			$("#contacts-list").empty().append(html);
		};
	



	/*******************/
	/*** NEW CONTACT ***/
	/*******************/


	$("#form-new-contact").on("submit", (event) => {
		event.preventDefault(); // prevent strange behavior submitting form ==> Investigate !!
		const $firstName = $("#first-name").val(),
			$lastName = $("#last-name").val(),
			$email = $("#email").val(),
			$phone = $("#phone").val(),
			$city = $("#city").val();
		new Contact($firstName, $lastName, $email, $phone, $city);
		$("#first-name").select();
	});




	/********************/
	/*** EDIT CONTACT ***/
	/********************/
	let role = localStorage.getItem('role');

	$(document).on("click", ".edit-contact.editable", (event) => {
		if(role == 'admin'){
			const $id = Number($(event.currentTarget).closest(".table-row").find(".contact-id").text()); // find contact.id
			const i = contactsArr.findIndex(contact => contact.id == $id); // find contacts index in array based on contact.id
			const form = contactsArr[i].toForm(); // get form version of row
			$(event.currentTarget).closest(".table-row").replaceWith(form); // replace current row with form
		}
		else{
			alert('You are not authorised, please contact the admin');
		}
	});

	$(document).on("click", ".cancel-edit-contact", (event) => {
		const $id = $(event.currentTarget).closest(".table-row").find(".contact-id").val(); // find contact.id
		const contact = contactsArr[contactsArr.findIndex(contact => contact.id == $id)]; // find contact in contactsArr
		$(event.currentTarget).closest(".table-row").replaceWith(contact.toHTML());
	});

	$(document).on("submit", ".form-edit-contact", (event) => {
		event.preventDefault();
		const $id = $(event.currentTarget).find(".contact-id").val(); // find contact.id
		const contact = contactsArr[contactsArr.findIndex(contact => contact.id == $id)]; // find contact in contactsArr
		contact.firstName = $(event.currentTarget).find(".first-name input").val();
		contact.lastName = $(event.currentTarget).find(".last-name input").val();
		contact.email = $(event.currentTarget).find(".email input").val();
		contact.phone = $(event.currentTarget).find(".phone input").val();
		contact.city = $(event.currentTarget).find(".city input").val();
		$(event.currentTarget).replaceWith(contact.toHTML( ));
	});



	/***********************/
	/*** DELETE CONTACTS ***/
	/***********************/

	
	$(document).on("click", ".delete-contact", (event) => {
		if(role == 'admin'){
			const arr = contactsArr.slice();
			const $id = Number($(event.currentTarget).closest(".table-row").find(".contact-id").text());
			const i = arr.findIndex(contact => contact.id == $id);
			contactsArr = arr.slice(0, i).concat(arr.slice(i + 1)); // remove contact from contacts array
			$(event.currentTarget).closest(".table-row").slideUp(300); // fade contact out of DOM
			setTimeout(() => $(event.currentTarget).closest(".table-row").remove(), 300); // remove contact from DOM
			console.log(`Contact id ${$id} removed`)
		}
		else{
			alert('You are not authorised, please contact your admin');
		}
	});



	/***********************/
	/*** SEARCH CONTACTS ***/
	/***********************/


	function filterContacts() {
		const $input = $("#search").val().toLowerCase().trim().split(/[\s]+/); // get input as array
		let filteredArr = contactsArr.filter(contact => {
			return Object.values(contact).some(x => {
				if (typeof x === "number") x = x.toString(); // contact.id number to string
				x = x.toLocaleLowerCase(); // match with lowercase (same as $input)
				return $input.some(word => x.includes(word)); // check if includes and return true or false
			});
		});
		$renderContacts(filteredArr); // render matches
	};
	$("#search").on("change paste keyup", filterContacts);




	/*********************/
	/*** SORT CONTACTS ***/
	/*********************/


	// Create a sort function
	function sortContacts(sortBy = "index", order = "asc") {
		let arr = contactsArr.slice();
		// ascending sort logic
		if (sortBy === "id") arr.sort((a, b) => a.id < b.id);
		else if (sortBy === "firstname") arr.sort((a, b) => a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : -1);
		else if (sortBy === "lastname") arr.sort((a, b) => a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1);
		else if (sortBy === "email") arr.sort((a, b) => a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1);
		else if (sortBy === "phone") arr.sort((a, b) => a.phone.split("").filter(x => /[0-9]/.test(x)).join("") > b.phone.split("").filter(x => /[1-9]/.test(x)).join("") ? 1 : -1);
		else if (sortBy === "city") arr.sort((a, b) => a.city.toLowerCase() > b.city.toLowerCase() ? 1 : -1);
		// reverse for descending
		if (order === "desc") arr.reverse();
		// render results
		$renderContacts(arr);
	};
	// Add listener to sort when clicking column headers
	$(document).on("click", ".sort-by", (event) => {
		// Toggle carrets
		$(event.currentTarget).find("span").removeClass("d-none"); // make visible if not allready
		$(event.currentTarget).closest(".table-cell").siblings().find("span").addClass("d-none"); // hide carrets from siblings
		$(event.currentTarget).find("span").toggleClass("fa-caret-up fa-caret-down"); // toggle up and down carret
		$("#reset-sort").fadeIn(300);
		// find conditions and sort
		const $sortBy = $(event.currentTarget).prop("id").slice().replace("-header", ""); // get sort by parameter from cell id
		const $sortAsc = $(event.currentTarget).find("span").prop("class").includes("fa-caret-up"); // returns true when caret is pointing up
		if ($sortAsc) sortContacts($sortBy, "asc");
		else sortContacts($sortBy, "desc");
		$("#search").val(""); // clear search box if not empty => fix later to sort search results instead !!
		$(".edit-contact").removeClass("editable"); // disable dragNdrop
		$(".edit-contact").addClass("inactive"); // disable dragNdrop
	});
	// Reset sort order
	$("#reset-sort").on("click", () => {
		$(".table-header").find(".table-cell span.fas").addClass("d-none");
		$(event.currentTarget).hide();
		$renderContacts();
	});



	/**********/
	/*** UI ***/
	/**********/


	// Fixed header on scroll
	const $headerPos = $('.table-header').offset().top; // get disance from top
	$(window).on("scroll", (event) => {
		const y = $(this).scrollTop(); // find current scroll position
		if (y >= $headerPos) $('.table-header').addClass('fixed');
		else $('.table-header').removeClass('fixed');
	});




	/***********************/
	/*** SAMPLE CONTACTS ***/
	/***********************/


	new Contact("MacKenzie", "Olson", "tincidunt.adipiscing@Fuscedolor.com", "899-5017", "1336 Nisi Rd., Romeral, Norfolk Island");
	new Contact("Silas", "Woodard", "Cum@sapienNuncpulvinar.edu", "1-700-395-6978", "897-5071 Auctor, Rd., Frederick, Nauru");
	new Contact("Savannah", "Langley", "blandit.at.nisi@urna.edu", "1-187-964-3386", "Ap #340-9710 Donec Road, Contagem, Myanmar");
	new Contact("Sawyer", "Kim", "tincidunt.aliquam@Morbi.com", "1-294-968-8449", "3765 Dui. St., Port Alice, Haiti");
	new Contact("Yael", "Mcknight", "cubilia@elitsedconsequat.net", "858-7595", "Ap #724-6244 Praesent Ave, Gujrat, Saint Vincent and The Grenadines");
	new Contact("Richard", "Coffey", "ut.eros.non@etmalesuadafames.net", "1-468-396-9357", "2090 Eleifend, Ave, Lincoln, Swaziland");
	new Contact("Paloma", "Glenn", "nunc@aliquamarcuAliquam.edu", "1-374-435-7442", "P.O. Box 897, 6311 Tellus Street, Sigillo, Saint Barthélemy");
	new Contact("Griffin", "Nolan", "vel@ipsumacmi.com", "1-637-898-8307", "P.O. Box 580, 7881 Neque Street, Belfort, South Sudan");
	new Contact("Uriah", "Stone", "Mauris.quis@arcuetpede.edu", "807-7735", "P.O. Box 215, 3609 Lacus. St., Londerzeel, Mexico");
	new Contact("Kelly", "Larson", "rutrum.lorem.ac@purusNullam.org", "173-2159", "Ap #400-7490 Vitae Road, San Venanzo, Zambia");
}
});
	