import React from 'react';
import {
    Card,
    CardBody,
    CardFooter,
    Image,
    Stack,
    Heading,
    Text,
    Divider,
    ButtonGroup,
    Button,
} from '@chakra-ui/react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

export default function ItemCard({ item }) {
    return (
      <Card maxW="sm">
        <CardBody>
          <Image src={item.image} borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Heading size="md">{item.name}</Heading>
            <Text>
              This sofa is perfect for modern tropical spaces, baroque inspired
              spaces, earthy toned spaces and for people who love a chic design
              with a sprinkle of vintage design.
            </Text>
            <Text color="blue.600" fontSize="2xl">
              RM {item.price}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter className='flex flex-row justify-between'> 
            <div className="flex flex-row items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
                <Text fontSize="sm" color="gray.500">
                    {item.owner}
                </Text>
            </div>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
                See more
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
}