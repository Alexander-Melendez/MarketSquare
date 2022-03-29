import { useState, useEffect } from 'react'
import { Image, Container, Row, Col } from 'react-bootstrap'

function ImgThumbs(fileInput) {

    const [images, setImages] = useState(fileInput);
    const [thumbs, setThumbs] = useState();

    setImages(fileInput)
    useEffect(() => {

        if (images) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbs(reader.result)
            }
            reader.readAsDataURL(images)

        } else {
            setThumbs(null)
        }
    }, [images])

    return (
        <Container>
            {thumbs.map((img, i) => {
                return <img className="float" src={img} alt={"image-" + i} key={i} />;
            })}
        </Container>
    )

}

export default ImgThumbs