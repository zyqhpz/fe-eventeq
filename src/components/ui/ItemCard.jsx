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
    <div
      key={item.id}
      className="flex max-w-xl flex-col items-start justify-between p-3 lg:p-5 space-y-6 transition duration-200 ease-in-out transform bg-white rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl"
    >
      <div className="group relative">
        {/* <img src={item.image} className="rounded-md" /> */}
        <img
          src="https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          className="rounded-md"
        />
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          {item.name}
        </h3>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-x-2">
          <img
            src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
            className="h-7 w-7 rounded-full bg-gray-50"
          />
          <p className="font-semibold text-gray-900">{item.owner}</p>
        </div>
        <p className="text-gray-500">RM {item.price} /day</p>
      </div>
    </div>
  );
}