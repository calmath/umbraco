[
    {
        "name": "Rich text editor",
        "alias": "rte",
        "view": "rte",
        "icon": "icon-article"
    },
    {
        "name": "Image",
        "alias": "media",
        "view": "media",
        "icon": "icon-picture"
    },
    {
        "name": "Macro",
        "alias": "macro",
        "view": "macro",
        "icon": "icon-settings-alt"
    },
    {
        "name": "Embed",
        "alias": "embed",
        "view": "embed",
        "icon": "icon-movie-alt"
    },
    {
        "name": "Headline",
        "alias": "headline",
        "view": "textstring",
        "icon": "icon-coin",
        "config": {
            "style": "font-size: 36px; line-height: 45px; font-weight: bold",
            "markup": "<h1>#value#</h1>"
        }
    },
    {
        "name": "Quote",
        "alias": "quote",
        "view": "textstring",
        "icon": "icon-quote",
        "config": {
            "style": "border-left: 3px solid #ccc; padding: 10px; color: #ccc; font-family: serif; font-style: italic; font-size: 18px",
            "markup": "<blockquote>#value#</blockquote>"
        }
    },
    {
        "name": "Accordion",
        "alias": "accordion",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-forms-stackoverflow",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "renderInGrid": "0",
            "min": 1,
            "max": 20,
            "expiration": 360,
            "frontView": "",
            "editors": [
                {
                    "name": "Theme",
                    "alias": "theme",
                    "propretyType": {},
                    "dataType": "e8a26794-16ad-45dd-9e75-4ea14e612d2c"
                },
                {
                    "name": "Question",
                    "alias": "question",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                },
                {
                    "name": "Answer",
                    "alias": "answer",
                    "propretyType": {},
                    "dataType": "ca90c950-0aff-4e72-b976-a30b1ac57dad"
                }
            ]
        }
    },
    {
        "name": "Call to action",
        "alias": "callToAction",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-settings-alt",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "Theme",
                    "alias": "theme",
                    "propretyType": {},
                    "dataType": "e8a26794-16ad-45dd-9e75-4ea14e612d2c"
                },
                {
                    "name": "Link",
                    "alias": "link",
                    "propretyType": {},
                    "dataType": "a5e00517-8b92-489a-8638-b81efb21de92"
                },
                {
                    "name": "Heading",
                    "alias": "heading",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                },
                {
                    "name": "Text",
                    "alias": "text",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                }
            ],
            "min": 1,
            "max": 1,
            "expiration": 0,
            "frontView": ""
        }
    },
    {
        "name": "Promo",
        "alias": "promo",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-settings-alt",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "Theme",
                    "alias": "theme",
                    "propretyType": {},
                    "dataType": "e8a26794-16ad-45dd-9e75-4ea14e612d2c"
                },
                {
                    "name": "Link",
                    "alias": "link",
                    "propretyType": {},
                    "dataType": "a5e00517-8b92-489a-8638-b81efb21de92"
                },
                {
                    "name": "Image",
                    "alias": "image",
                    "propretyType": {},
                    "dataType": "135d60e0-64d9-49ed-ab08-893c9ba44ae5"
                },
                {
                    "name": "Heading",
                    "alias": "heading",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                },
                {
                    "name": "Text",
                    "alias": "text",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                }
            ],
            "min": 1,
            "max": 1,
            "frontView": ""
        }
    },
    {
        "name": "Image with Headline",
        "alias": "imageWithHeadline",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-settings-alt",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "Image",
                    "alias": "image",
                    "propretyType": {},
                    "dataType": "135d60e0-64d9-49ed-ab08-893c9ba44ae5"
                },
                {
                    "name": "Headline",
                    "alias": "headline",
                    "propretyType": {},
                    "dataType": "369cb1ce-c7ee-440e-a324-7806cb3d80ac"
                },
                {
                    "name": "Link",
                    "alias": "link",
                    "propretyType": {},
                    "dataType": "7c890234-b597-4cc7-aeb7-15350778a1e3"
                }
            ],
            "min": 1,
            "max": 1,
            "frontView": ""
        }
    },
    {
        "name": "Multiple Images",
        "alias": "multipleImages",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-pictures-alt-2",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "image",
                    "alias": "image",
                    "propretyType": {},
                    "dataType": "20d89620-4ba2-4d4e-a1f7-efb3d7e80e22"
                },
                {
                    "name": "link",
                    "alias": "link",
                    "propretyType": {},
                    "dataType": "7c890234-b597-4cc7-aeb7-15350778a1e3"
                }
            ],
            "frontView": "",
            "min": 1,
            "max": 5
        }
    },
    {
        "name": "Script Block",
        "alias": "scriptBlock",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-settings-alt",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "Script",
                    "alias": "script",
                    "propretyType": {},
                    "dataType": "c6bac0dd-4ab9-45b1-8e30-e4b619ee5da3"
                }
            ],
            "min": 1,
            "max": 1,
            "frontView": ""
        }
    },
    {
        "name": "Document Listing",
        "alias": "documentListing",
        "view": "/App_Plugins/LeBlender/editors/leblendereditor/LeBlendereditor.html",
        "icon": "icon-forms-file-pdf",
        "render": "/App_Plugins/LeBlender/editors/leblendereditor/views/Base.cshtml",
        "config": {
            "editors": [
                {
                    "name": "Heading",
                    "alias": "heading",
                    "propretyType": {},
                    "dataType": "0cc0eba1-9960-42c9-bf9b-60e150b429ae"
                },
                {
                    "name": "Description",
                    "alias": "description",
                    "propretyType": {},
                    "dataType": "c6bac0dd-4ab9-45b1-8e30-e4b619ee5da3"
                },
                {
                    "name": "Document",
                    "alias": "document",
                    "propretyType": {},
                    "dataType": "135d60e0-64d9-49ed-ab08-893c9ba44ae5"
                }
            ],
            "min": 1,
            "max": 10,
            "frontView": ""
        }
    }
]