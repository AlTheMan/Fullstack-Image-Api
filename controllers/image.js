

export const newImage = (req, res, next) => {
   console.log(req.file)
   res.json({message: "Uploaded"})
}

export const getAllImages = (req, res, next) => {
    res.json({message: "GET all images"})
}

export const getUserImages = (req, res, next) => {
    res.json({message: req.json})
}




