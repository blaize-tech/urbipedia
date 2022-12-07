import React, {useState} from 'react'
import Image from 'next/image'
import {Container} from '@chakra-ui/react'

//import '../../../public/placeholder.png'

export interface OrgImageProps {
    src: string
    file: string
}

export const OrgImage = (props: OrgImageProps) => {
    const {src, file} = props

    // const [image, setImage] = useState<any>(null)

    /* )
  *   .then((res) => res.blob())
  *   .then((res) => setImage(res))
  *   .catch((e) => {
  *     setImage(null)
  *     console.error(e)
  *   })
  }, [fullPath]) */

    const dumbLoader = ({src, width, quality}: { [key: string]: string | number }) => {
        return `${src}`
    }

    if (src.replaceAll(/(http)?.*/g, '$1')) {
        console.log(src.replaceAll(/(http)?.*/g, '$1'))
        return (
            <Image layout="responsive" loader={dumbLoader} src={src} alt="" width="auto" height="auto"/>
        )
    }


    return (
        <Container my={4} position="relative"/>
    )
}
