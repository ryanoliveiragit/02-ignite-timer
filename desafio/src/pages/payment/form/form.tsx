import {
  Container,
  InputNumberAndComplement,
  ContainerForm,
  ContainerInputs,
  Payment,
  AdressDescription,
  DefaultInput,
  InputStreat,
  Flex,
  CartContainer,
  Values,
  ValueNumber,
  ValueTotalNumber,
  Total,
  ButtonSubmit,
} from "./styles";
import { MapPin, CurrencyDollar } from "@phosphor-icons/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkout } from "../checkout";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../../components/layout";

const cepValidator = z.string().refine(
  (cep) => {
    const formattedCep = cep.replace(/\D/g, "");
    return formattedCep.length === 8;
  },
  { message: "Digite um CEP válido no formato 12345678" }
);

const schema = z.object({
  cep: cepValidator,
  rua: z.string().max(40).nonempty({ message: "Campo obrigatório" }),
  numero: z
    .string()
    .min(1, { message: "Digite um número válido" })
    .nonempty({ message: "Campo obrigatório" }),
  complemento: z.string(),
  bairro: z.string().nonempty({ message: "Campo obrigatório" }),
  cidade: z.string().nonempty({ message: "Campo obrigatório" }),
  uf: z.string().nonempty({ message: "Campo obrigatório" }),
});

type FormProps = z.infer<typeof schema>;

import { useForm } from "react-hook-form";
import { useCart } from "../../../contexts/myContexts";
import { Navbar } from "../../../components/header/navBar";

export function Form() {
  const navigate = useNavigate();
  const { cart, adress, addNewAdress, setCart } = useCart();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    mode: "all",
  });

  function onSubmit(data: any) {
    addNewAdress(data);
    reset();
    console.log(adress);
    navigate('/sucess')
    setCart([]);
  }

  const totalPrice = cart.reduce((total, coffee) => total + coffee.price, 0);
  const number = totalPrice;
  const roundedNumber = parseFloat(number.toFixed(2)); // Converter para número com 2 casas decimais
  const frete = 30;
  const totalValue = roundedNumber + frete;

  const isCartEmpty = cart.length === 0;
  const buttonClass = isCartEmpty ? "disabled" : "enabled";

  console.log(errors);
  return (
    <Layout>
      <Container>
        <Navbar />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex>
            <ContainerForm>
              <AdressDescription>
                <div>
                  <MapPin size={20} color="#C47F17" />
                  <h1>Endereço de Entrega</h1>
                </div>
                <p>Informe o endereço onde deseja receber seu pedido</p>
              </AdressDescription>

              <ContainerInputs>
                <DefaultInput>
                  <input
                    {...register("cep")}
                    type="text"
                    placeholder="CEP"
                    pattern="[0-9]*"
                  />
                </DefaultInput>

                <InputStreat>
                  <div>
                    <input
                      {...register("rua")}
                      type="text"
                      placeholder="Rua"
                      maxLength={40}
                    />
                  </div>
                </InputStreat>

                <InputNumberAndComplement>
                  <input
                    {...register("numero")}
                    type="number"
                    id="numero"
                    placeholder="Número"
                    maxLength={15}
                  />
                  <DefaultInput>
                    <input
                      {...register("complemento")}
                      type="text"
                      placeholder="Complemento"
                    />
                  </DefaultInput>
                </InputNumberAndComplement>

                <InputNumberAndComplement>
                  <DefaultInput>
                    <input
                      {...register("bairro")}
                      type="text"
                      placeholder="Bairro"
                    />
                  </DefaultInput>

                  <input
                    {...register("cidade")}
                    type="text"
                    placeholder="Cidade"
                  />

                  <input
                    {...register("uf")}
                    type="text"
                    id="uf"
                    maxLength={2}
                    placeholder="UF"
                  />
                </InputNumberAndComplement>
              </ContainerInputs>
              <Payment>
                <AdressDescription>
                  <div>
                    <CurrencyDollar size={20} color="#8047F8" />
                    <h1>Pagamento</h1>
                  </div>
                  <p>
                    O pagamento é feito na entrega. Escolha a forma que deseja
                    pagar
                  </p>
                </AdressDescription>
              </Payment>
            </ContainerForm>
            <CartContainer>
              <Checkout />
              <Values>
                <div>
                  <span>Total de itens</span>
                  <ValueNumber>R$ {roundedNumber}</ValueNumber>
                </div>

                <div>
                  <span>Entrega</span>
                  <ValueNumber>R$ {frete}</ValueNumber>
                </div>

                <div>
                  <Total>Total</Total>
                  <ValueTotalNumber>R$ {totalValue}</ValueTotalNumber>
                </div>
              </Values>
              <ButtonSubmit
                type="submit"
                disabled={isCartEmpty}
                className={buttonClass}
              >
                Confirmar pedido
              </ButtonSubmit>
            </CartContainer>
          </Flex>
        </form>
      </Container>
    </Layout>
  );
}
