import { Input } from "@kofile/gds-react"
import { useEffect, useState } from "react"

type EditableCellProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValue:() => any,
    row: any,
    column:any,
    table:any
}

export const EditableCell = ({getValue ,row, column, table }:EditableCellProps) => {
    const initialValue = getValue()
    const [value, setValue] = useState<string>(initialValue)

    const onBlur = () =>{
        table.options.meta?.updateData(row.index,column.id,value)
    }
    useEffect(() =>{
        setValue(initialValue)
    },[initialValue])

  return (
    <Input>
        <Input.Input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
    </Input>
  )
}