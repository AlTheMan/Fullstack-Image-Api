
export const getBase = async (req, res, next) => {
    return res.status(200).json({message: "It's working! (Image-api)"});
}

export const getHealth = async (req, res, next) => {
    
    return res.status(200).json({message: "OK!"});
}