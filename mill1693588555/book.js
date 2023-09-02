module.exports = {
	title: "field notes",
	subtitle: "blueatlas ::: fieldnotes",
	description: "the rider passenger repair(*)",
	rooturl: "https://textfactory.work",
	file: "indexbook",
	authorurl: "https://mctavish.work/index.html",
	author: "mctavish",
	copyright: "Copyright ©2021 mctavish<br/>",
	isbn: "ISBN: 00000<br/>",
	publisher: "Wildwood River Press",
	sections: [
		{ 
			id: "sectiontoc",
			title: "Table of Contents",
			cssclasses: ["pagenonumbers", "notoc"],
			generatorf: "generateTOC",
		},
		{ 
			id: "sectionfieldnotes",
			title: "the repair(*)",
			inscription: "it was like this every morning ...",
			cssclasses: ["pagestartnumbers"],
			poems: [
				"001",
				"002",
			]
		},
	],
	poemids: [
	],
}
