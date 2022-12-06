import type { FunctionComponent } from 'react'

import Paragraph from 'components/Paragraph'
import type { Address as AddressType } from 'types/address'

type AddressProps = {
  address: AddressType | null
}

const Address: FunctionComponent<AddressProps> = ({ address }) => (
  <div>
    {address ? (
      <>
        <Paragraph>
          {address.openbare_ruimte} {address.huisnummer}
          {address.huisletter}
          {address.huisnummer_toevoeging
            ? `-${address.huisnummer_toevoeging}`
            : ''}
        </Paragraph>
        <Paragraph>
          {address.postcode} {address.woonplaats}
        </Paragraph>
      </>
    ) : (
      <Paragraph>Locatie is gepind op de kaart</Paragraph>
    )}
  </div>
)

export default Address
