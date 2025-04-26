import React, { useState } from 'react'
import { TableCell, TableRow } from '../../ui/table';
import Badge from '../../ui/badge/Badge';
import Checkbox from '../../form/input/Checkbox';
interface Order{
    order: any
}
const RowItem: React.FC<Order> = ({order}) => {
    const [isChecked, setIsChecked] = useState(order.status == "Active")
  return (
    
    <TableRow key={order.id}>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {order.projectName}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <div className="flex -space-x-2">
        {order.team.images.map((teamImage: string | undefined, index: React.Key | null | undefined) => (
          <div
            key={index}
            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
          >
            <img
              width={24}
              height={24}
              src={teamImage}
              alt={`Team member ${index??0 + 1}`}
              className="w-full size-6"
            />
          </div>
        ))}
      </div>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <Badge
        size="sm"
        color={
          order.status === "Active"
            ? "success"
            : order.status === "Pending"
            ? "warning"
            : "error"
        }
      >
        {order.status}
      </Badge>
    </TableCell>
   
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
      {order.deadline}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
      <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e)}/>
    </TableCell>
  </TableRow>
  )
}

export default RowItem