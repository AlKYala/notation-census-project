const r = {
  // this file is in JS so one can use comments and other flexibilities
  // ... a data-element in JS is a module whose default object is our object
  // Being JS one can avoid quotes on prop-names, use multiline strings, and use comments.

  type: "multi-observations",
  // properties in the root of a multi-observations are considered inherited to all observations
  semantic: "interval1-interval-oc",
  observations: [
    {
      image: "interval-oc-en.png",
      context: "en-us-college",
      name_in_context: "half-open interval",
      source: "Precalculus-Larson-Hostetler-Falvo",
      direct_link: {"google books": "http://books.google.com/books?id=g1Bul7oPMF4C&lpg=PA574&dq=Row%20matrix&pg=SL1-PA2#v=onepage&q&f=false"}
    },

    {
      image: "interval-oc-de.png",
      context: "de",
      name_in_context: "halboffenes (genauer rechtsoffenes) Intervall'",
      source: "Analysis1-Forster",
      direct_link: {"google books": "http://books.google.com/books?id=H73afLxZXf4C&lpg=PP1&pg=PA145#v=onepage&q&f=false"}
    },

    {
      image: "interval-oc-nl.png",
      context: "nl",
      source: "Basisbook-Wiskunde-vanDeCraats",
    },

  ]

}


export default r;