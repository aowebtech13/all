import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { PaylioContext } from "@/context/context";

const RecipientsTable = () => {
  const { recipients } = useContext(PaylioContext);
  return (

    <table className="table">
      <thead>
        <tr>
          <th scope="col">Name/ Business</th>
          <th scope="col">Last transfer date</th>
          <th scope="col">Last transfer amount</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {(recipients || []).map((recipient) => (

          <tr key={recipient.id} data-bs-toggle="modal" data-bs-target="#cardMod1">
            <th scope="row">
              <div className="info-area">
                <div className="img-area">
                  <Image
                    src={recipient.image}
                    width={40}
                    height={40}
                    alt={recipient.name}
                  />
                </div>
                <div className="text-area">
                  <p>{recipient.name}</p>
                  <p className="mdr">{recipient.email}</p>
                </div>
              </div>
            </th>
            <td>
              <p>{recipient.lastTransferTime}</p>
              <p className="mdr">{recipient.lastTransferDate}</p>
            </td>
            <td>
              <p>{recipient.amount}</p>
              <p className="mdr">{recipient.status}</p>
            </td>
            <td className="btn-item">
              <Link href="#">Send Fund</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecipientsTable;
