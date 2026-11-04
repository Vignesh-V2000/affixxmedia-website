# AffixxMedia website revamp

This is a standalone, responsive frontend for AffixxMedia. Open `site/index.html` or run the following from this folder to serve all five pages locally.

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory site
```

Then open [the local preview](http://127.0.0.1:4173/). The frontend uses HTML, CSS and JavaScript. It has no package installation or build step. To host it, serve the contents of `site/` as static files.

| Page | Local file | Visitor task |
| --- | --- | --- |
| Home | `site/index.html` | Understand the offer, see client proof and find a service or consultation |
| Services | `site/services.html` | Explore six services and start an enquiry with the relevant service selected |
| About | `site/about.html` | Learn where the agency works and how it approaches client relationships |
| Insights | `site/insights.html` | Discover and open the original AffixxMedia articles |
| Contact | `site/contact.html` | Open a draft email, call, use WhatsApp or continue to the live contact form |

The contact form prepares a draft addressed to AffixxMedia’s published email address. Visitors review and send it in their own email app. The live contact form is linked separately. Careers, legal pages, and full blog articles link to the original site.

The five pages were checked in Chrome at eight widths from 320px to 1920px. Checks covered local links and assets, font loading, layout overflow, keyboard navigation, service disclosures, contact validation, email draft assembly and reduced motion.

The logo, client marks, portraits, office photo and article art came from [AffixxMedia](https://affixxmedia.com/). Plus Jakarta Sans is bundled under its [SIL Open Font License](site/assets/OFL-Plus-Jakarta-Sans.txt). The copper sculpture is original generated concept art for this redesign. The [design notes](design.md) document the audit and system. The `screenshots/` folder contains browser captures.
