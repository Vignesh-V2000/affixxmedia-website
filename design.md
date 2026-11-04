# AffixxMedia design

AffixxMedia’s identity already has a strong material cue. The default site uses copper against near-black, a shield with angular facets and Plus Jakarta Sans. The revamp uses those elements across the five pages, with warm ivory for reading and copper as a signal for actions.

## Existing site review

| Surface | Observation | Redesign response |
| --- | --- | --- |
| Homepage | The promise leads the page. The consultation action is down in the expertise section. Service names repeat in the expertise and service lists. | A single hero explains the offer, gives visitors an enquiry action and leads to one service index. |
| Navigation | Desktop and mobile use separate menus, and the mobile service dropdown omits Web Growth. | Both menus expose the same main pages. The Services page makes all six offers available without a dropdown. |
| Client proof | Logos and testimonials repeat in looping markup. | The five existing client marks sit in a static strip. Three existing client voices appear in a manually controlled carousel. |
| About and blog | About carries mission, vision and values. The blog has its own reading destinations. | Dedicated About and Insights pages keep the content easy to find and link to the published articles. |
| Contact | The live contact page includes its own form integration and publishes phone, email and WhatsApp details. | The static preview offers those direct channels, a clearly labelled draft and a link to the live form. |

Sources for the review are the original homepage, About, Contact, shared header and footer, and the stylesheet. The original site served its source through HTTP. Automated Chrome screenshots of the original were blocked, so layout observations are based on the markup and CSS.

- [Homepage](https://affixxmedia.com/)
- [About](https://affixxmedia.com/about.html)
- [Contact](https://affixxmedia.com/contact.html)
- [Shared navigation](https://affixxmedia.com/header.html)
- [Brand stylesheet](https://affixxmedia.com/css/style.css)

## Shared system

The [design model](design-model.yaml) records the observed brand and redesign decisions. The implemented values live in [tokens.css](site/tokens.css). Headings and body use the same family, with weight and scale defining hierarchy. Paragraphs cap at 67ch, and inputs use the 1rem body scale. Links and controls have immediate focus rings. Motion is limited to brief directional feedback and respects the reduced-motion setting.

The homepage’s signature is a studio image of a folded copper sculpture. Its upward facets recall the shield’s geometry and give the hero an image tied to the brand. The asset was generated with the built-in image tool using the prompt below.

> Landscape 3:2 premium studio product photograph, no text, for a copper-and-charcoal design agency website. A large angular folded sculpture made from a single sheet of brushed copper rises toward the upper right like an abstract wing in motion. Crisp intersecting planar faces and physically plausible fine grain, burnished edges catch soft rose-copper light. Object centered and kept completely in frame with generous near-black margins, lit dramatically from upper left against a seamless warm charcoal #151210 background. Rich muted metallic tones and quiet deep shadows. Real museum design object, editorial still life, no logo, no watermark, no people, no lettering.

[Hero asset](site/assets/copper-hero.webp)
