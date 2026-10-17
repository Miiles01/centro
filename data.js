/**
 * UGC Portfolio Data
 * Centralised data file for easy rebranding / new versions
 */
window.UGC_DATA = {
  creator: {
    name: "Laura",
    tagline: "Creadora de contenido UGC para marcas de belleza, moda y bienestar",
    bioP1: "Soy Laura. Hago videos y fotos que se sienten como la recomendación de una amiga: reales, cercanos y pensados para que tu producto se vea en uso.",
    bioP2: "Me encargo de todo: idea, guion, grabación y edición en formato vertical, listo para publicar en TikTok, Reels o anuncios.",
    bioP3: "Trabajo con marcas de belleza, moda y bienestar que buscan contenido honesto que genere confianza y ventas.",
    email: "hola@lauracreativa.com",
    whatsapp: "https://wa.me/",
    socials: {
      instagram: { user: "@laura.ugc", url: "https://instagram.com" },
      tiktok: { user: "@laura.ugc", url: "https://tiktok.com" },
      youtube: { user: "@laura.ugc", url: "https://youtube.com" }
    }
  },

  media: {
    base: "https://wearemiiles.com/ugc-v4/media/",
    portada: "portada.jpg",
    hero: "hero.jpg",
    sobreMi: "sobre-mi.jpg"
  },

  brands: [
    { name: "Adidas", logo: "marcas/adidas-13.svg" },
    { name: "Chanel", logo: "marcas/chanel-2.svg" },
    { name: "DJI", logo: "marcas/dji-1.svg" },
    { name: "L'Oréal", logo: "marcas/loreal.svg" },
    { name: "La Roche-Posay", logo: "marcas/la-roche-posay.svg" },
    { name: "Samsung", logo: "marcas/samsung-8.svg" },
    { name: "Spotify", logo: "marcas/spotify-logo.svg" },
    { name: "Vichy", logo: "marcas/vichy-laboratoires.svg" },
    { name: "Zoah", logo: "marcas/zoah-1.svg" },
    { name: "Zara", logo: "marcas/zara.svg" },
    { name: "Vogue", logo: "marcas/vogue.svg" },
    { name: "Versace", logo: "marcas/versace.svg" },
    { name: "Pull&Bear", logo: "marcas/pull-bear-2.svg" },
    { name: "Bershka", logo: "marcas/bershka-1.svg" },
    { name: "Shein", logo: "marcas/shein.svg" }
  ],

  carousel: [
    { title: "Rutina de cuidado", format: "Reel", niche: "Belleza", type: "video", file: "video-1.mp4" },
    { title: "Ropa deportiva", format: "Foto", niche: "Moda", type: "image", file: "foto-1.jpg" },
    { title: "Primeras impresiones", format: "Reel", niche: "Lifestyle", type: "video", file: "video-2.mp4" },
    { title: "Entrenamiento", format: "Foto", niche: "Bienestar", type: "image", file: "foto-2.jpg" },
    { title: "Reseña honesta", format: "Reel", niche: "Producto", type: "video", file: "video-3.mp4" },
    { title: "Día al aire libre", format: "Foto", niche: "Lifestyle", type: "image", file: "foto-3.jpg" },
    { title: "Unboxing", format: "Reel", niche: "Producto", type: "video", file: "video-4.mp4" },
    { title: "Retrato natural", format: "Foto", niche: "Belleza", type: "image", file: "foto-4.jpg" },
    { title: "Selfie de producto", format: "Foto", niche: "UGC", type: "image", file: "foto-5.jpg" }
  ],

  niches: [
    { id: "01", name: "Belleza y skincare", detail: "Rutinas, texturas, antes y después y primeras impresiones." },
    { id: "02", name: "Moda", detail: "Try-on hauls, outfits y cómo combinar una prenda." },
    { id: "03", name: "Bienestar y fitness", detail: "Entrenamientos, suplementos y hábitos diarios." },
    { id: "04", name: "Lifestyle y hogar", detail: "Mi día a día, productos en casa y momentos reales." }
  ],

  contentTypes: [
    { id: "01", title: "Videos UGC para anuncios", example: "Hook en 3 segundos, problema, solución y llamada a la acción." },
    { id: "02", title: "Unboxing", example: "Abro tu producto y muestro cada detalle por primera vez." },
    { id: "03", title: "Reseñas y testimoniales", example: "Opinión honesta a cámara, como recomendación de amiga." },
    { id: "04", title: "Tutoriales", example: "Paso a paso de cómo se usa tu producto." },
    { id: "05", title: "Fotografía de producto", example: "Fotos lifestyle con el producto en uso." }
  ],

  testimonials: [
    {
      quote: "Laura entendió la visión de nuestra marca desde el primer momento. El contenido superó nuestras expectativas.",
      role: "Directora de Marketing",
      company: "Tech Innovators",
      avatar: "testimonios/persona-1.jpg"
    },
    {
      quote: "Su capacidad para contar historias a través de la fotografía es única. Cada proyecto es un éxito garantizado.",
      role: "Fundador",
      company: "Artisan Coffee Co.",
      avatar: "testimonios/persona-2.jpg"
    },
    {
      quote: "El nivel de atención al detalle que Laura le puso a nuestra última campaña fue increíble.",
      role: "Directora de Arte",
      company: "Fashion Forward",
      avatar: "testimonios/persona-3.jpg"
    },
    {
      quote: "Logró capturar la esencia de lo que somos en cada toma. Es una verdadera profesional.",
      role: "CEO",
      company: "Eco Beauty",
      avatar: "testimonios/persona-4.jpg"
    },
    {
      quote: "Transformó por completo la manera en la que nuestra audiencia nos percibe visualmente.",
      role: "Brand Manager",
      company: "Luxe Events",
      avatar: "testimonios/persona-5.jpg"
    },
    {
      quote: "Una creatividad desbordante y una técnica impecable. Sus fotos hablan por sí solas.",
      role: "Editor en Jefe",
      company: "Revista Estilo",
      avatar: "testimonios/persona-6.jpg"
    }
  ],

  contact: {
    title: "Hagamos algo juntas",
    subtitle: "Cuéntame de tu marca y de lo que necesitas. Te respondo en menos de 24 horas.",
    email: "hola@lauracreativa.com"
  },

  footer: {
    copy: "© 2026 Laura · Plantilla UGC de We Are Miiles"
  }
};
