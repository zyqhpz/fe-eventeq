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

import path from "../utils/path";

export default function ItemCard({ item }) {

  var imagePath = path.url + "api/item/image/" + item.Images[0]

  var detailsPath = "/listing/item/" + item.ID;

  return (
    <a
      key={item.ID}
      className="flex max-w-xl flex-col items-start justify-between p-3 lg:p-5 space-y-6 transition duration-200 ease-in-out transform bg-white rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl"
      href={detailsPath}
    >
      <div className="group relative">
        <img src={imagePath} className="rounded-md object-cover h-44 w-52" />
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          {item.Name}
        </h3>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-x-2">
          {item.OwnedBy.IsImageAvatarSet ? (
            <img
              src={path.url + "api/user/image/" + item.OwnedBy.UserImageAvatar}
              alt=""
              className="h-7 w-7 rounded-full bg-gray-50"
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser}
              className="h-7 w-7 text-gray-500"
            />
          )}
          <p className="font-semibold text-gray-900">
            {item.OwnedBy.FirstName} {item.OwnedBy.LastName}
          </p>
        </div>
        <p className="text-gray-500">RM {item.Price} /day</p>
      </div>
    </a>
  );
}