import React from "react"
import PropTypes from "prop-types"
import Marked from "marked"
import Highlightjs from "highlight.js"
import sanitize from "sanitize-html"

function Markdown({ source }) {
    // const html = new Remarkable({
    //     html: true,
    //     typographer: true,
    //     breaks: true,
    //     linkify: true,
    //     linkTarget: "_blank"
    // }).render(source)

    const html = Marked(source, {
      highlight: function (code) {
        var val = Highlightjs.highlightAuto(code)
        return val.value
      }
    });
    const sanitized = sanitizer(html)

    if ( !source || !html || !sanitized ) {
        return null
    }

    return (
        <div data-marked="specs.info.description" dangerouslySetInnerHTML={{ __html: sanitized }}></div>
    )
}

Markdown.propTypes = {
    source: PropTypes.string.isRequired
}

export default Markdown

const sanitizeOptions = {
    allowedTags: sanitize.defaults.allowedTags.concat([ "h1", "h2", "img", "aside", "span" ]),
    allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        "img": sanitize.defaults.allowedAttributes.img.concat(["title"]),
        "aside": ["class"],
        "span": ["class"],
        "code": ["class"]
    },
    textFilter: function(text) {
        return text.replace(/&quot;/g, "\"")
    }
}

export function sanitizer(str) {
    return sanitize(str, sanitizeOptions)
}
