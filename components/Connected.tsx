import {
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react"
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachine,
  CandyMachineV2
} from "@metaplex-foundation/js"
import { useRouter } from "next/router"

const Connected: FC = () => {
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    if (!metaplex) return

    metaplex
      .candyMachinesV2()
      .findByAddress({
        address: new PublicKey("AsEM35WRaa71EM1Tp4YEeCLBxk7EnHB3CjEfVjgQtB3s"),
      })
      .then((candyMachine) => {
        console.log(candyMachine)
        setCandyMachine(candyMachine)
      })
      .catch((error) => {
        alert(error)
      })
  }, [metaplex])

  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return

      if (!walletAdapter.connected || !candyMachine) {
        return
      }

      try {
        setIsMinting(true)
        const nft = await metaplex.candyMachinesV2().mint({
          candyMachine,
    });
        console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (error) {
        alert(error)
      } finally {
        setIsMinting(false)
      }
    },
    [walletAdapter.connected, candyMachine, metaplex, router]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Fashion Babe!
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each CLTHing Item is randomly generated and can be staked to receive
            <Text as="b"> $CLTH</Text>. Use your <Text as="b"> $CLTH</Text> to
            upgrade your CLTHing and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="../images/avatar1.png" alt="" />
        <Image src="../images/avatar2.png" alt="" />
        <Image src="../images/avatar3.png" alt="" />
        <Image src="../images/avatar4.png" alt="" />
        <Image src="../images/avatar5.png" alt="" />
      </HStack>

      <Button
        bgColor="accent"
        color="white"
        maxW="381px"
        onClick={handleClick}
        isLoading={isMinting}
      >
        <Text>Mint some CLTHing</Text>
      </Button>
    </VStack>
  )
}
// please
export default Connected
