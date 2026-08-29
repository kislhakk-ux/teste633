import React, { useState } from 'react';
import { ItemId, RoadsideBox } from '../types/game';
import { MultiplayerOffer } from '../types/multiplayer';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface RoadsideShopModalProps {
  initialTab?: 'stand' | 'newspaper';
  boxes: RoadsideBox[];
  inventory: Record<ItemId, number>;
  coins: number;
  myFarmId: string;
  newspaperOffers: MultiplayerOffer[];
  onClose: () => void;
  onPutItemOnSale: (
    boxId: number,
    itemId: ItemId,
    count: number,
    price: number,
    advertised: boolean
  ) => void;
  onCollectBoxMoney: (boxId: number) => void;
  onBuyNewspaperItem: (offerId: string) => void;
  onVisitFarm: (farmId: string) => void;
  onOpenMultiplayerModal: () => void;
  onRefreshNewspaper?: () => void;
}

export const RoadsideShopModal: React.FC<RoadsideShopModalProps> = ({
  initialTab = 'stand',
  boxes,
  inventory,
  coins,
  myFarmId,
  newspaperOffers,
  onClose,
  onPutItemOnSale,
  onCollectBoxMoney,
  onBuyNewspaperItem,
  onVisitFarm,
  onOpenMultiplayerModal,
  onRefreshNewspaper,
}) => {
  const [activeTab, setActiveTab] = useState<'stand' | 'newspaper'>(initialTab);
  const [newspaperFilter, setNewspaperFilter] = useState<'all' | 'crops' | 'products' | 'expansion' | 'real_players'>('all');
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [sellItem, setSellItem] = useState<ItemId | null>(null);
  const [sellCount, setSellCount] = useState<number>(1);
  const [sellPrice, setSellPrice] = useState<number>(10);
  const [sellAdvertised, setSellAdvertised] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSelectBox = (box: RoadsideBox) => {
    if (box.isSold) {
      sound.playCoin();
      onCollectBoxMoney(box.id);
      return;
    }
    if (!box.itemId) {
      setSelectedBoxId(box.id);
      setSellItem(null);
      setSellCount(1);
      setSellAdvertised(true);
    }
  };

  const handleConfirmSale = () => {
    if (selectedBoxId !== null && sellItem) {
      sound.playClick();
      onPutItemOnSale(selectedBoxId, sellItem, sellCount, sellPrice, sellAdvertised);
      setSelectedBoxId(null);
      setSellItem(null);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    sound.playClick();
    if (onRefreshNewspaper) {
      onRefreshNewspaper();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter newspaper offers
  const filteredOffers = newspaperOffers.filter((offer) => {
    if (!offer.advertised) return false;

    if (newspaperFilter === 'real_players') {
      return !offer.sellerFarmId.startsWith('npc_');
    }

    const it = ITEMS[offer.itemId];
    if (!it) return true;

    if (newspaperFilter === 'crops') {
      return it.category === 'crop';
    }
    if (newspaperFilter === 'products') {
      return it.category === 'animal_product' || it.category === 'feed' || it.category === 'food';
    }
    if (newspaperFilter === 'expansion') {
      return it.category === 'material';
    }

    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-3xl w-full relative flex flex-col gap-3.5 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-600/30 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('stand');
              }}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                activeTab === 'stand'
                  ? 'bg-amber-600 text-white border-white shadow-md scale-105'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>🏪</span> Minha Banca de Vendas
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('newspaper');
              }}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                activeTab === 'newspaper'
                  ? 'bg-red-700 text-white border-white shadow-md scale-105 ring-2 ring-red-400/50'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>📰</span> Jornal do Fazendeiro
              <span className="bg-yellow-400 text-amber-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-yellow-200 shadow-xs">
                Ao Vivo
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenMultiplayerModal();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-400 text-[11px] font-black text-amber-900 shadow-xs cursor-pointer"
              title="Conectar outros celulares e computadores"
            >
              <span>🌐</span>
              <span>Conectar Aparelhos</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Roadside Stand Boxes */}
        {activeTab === 'stand' && (
          <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white/70 p-2.5 rounded-2xl border border-amber-300">
              <p className="text-xs text-amber-950 font-bold leading-tight">
                🌾 Coloque produtos à venda! Anuncie no <strong>Jornal</strong> para que outros aparelhos e vizinhos comprem em tempo real!
              </p>
              <button
                onClick={onOpenMultiplayerModal}
                className="text-[11px] font-black text-amber-800 bg-amber-200/80 hover:bg-amber-200 px-3 py-1 rounded-xl border border-amber-400 shrink-0 cursor-pointer"
              >
                📱 Enviar Link para Celular
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {boxes.map((box) => {
                const itemDef = box.itemId ? ITEMS[box.itemId] : null;

                return (
                  <div
                    key={box.id}
                    onClick={() => handleSelectBox(box)}
                    className={`h-38 rounded-2xl border-3 p-3 flex flex-col items-center justify-between cursor-pointer transition-all shadow-md relative ${
                      box.isSold
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400 animate-pulse'
                        : box.itemId
                        ? 'bg-[#fff8e1] border-amber-400 hover:bg-amber-50 hover:scale-[1.02]'
                        : 'bg-amber-100/50 border-dashed border-amber-400 hover:bg-amber-100'
                    }`}
                  >
                    {/* Top indicator */}
                    <div className="w-full flex items-center justify-between text-[10px] font-black text-amber-900">
                      <span>Caixa #{box.id}</span>
                      {box.advertised && !box.isSold && (
                        <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold shadow-xs flex items-center gap-0.5">
                          <span>📢</span> No Jornal
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    {box.isSold ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl">💰</span>
                        <span className="text-xs font-black text-emerald-950">
                          Vendido!
                        </span>
                        <div className="bg-emerald-600 text-white font-black text-xs px-2 py-0.5 rounded-full shadow border border-white">
                          +🪙 {box.price}
                        </div>
                      </div>
                    ) : box.itemId ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-3xl filter drop-shadow-xs">{itemDef?.icon}</span>
                        <span className="font-black text-xs text-amber-950 truncate max-w-[130px] text-center">
                          {box.count}x {itemDef?.name}
                        </span>
                        <span className="text-xs font-black text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300">
                          🪙 {box.price}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center my-auto text-amber-700">
                        <span className="text-3xl font-light">+</span>
                        <span className="text-[11px] font-bold">Vender Item</span>
                      </div>
                    )}

                    <div className="text-[9px] font-semibold text-amber-800/90 text-center">
                      {box.isSold
                        ? 'Toque para coletar as moedas!'
                        : box.itemId
                        ? 'À venda para outros jogadores'
                        : 'Espaço vazio'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Put on sale popup */}
            {selectedBoxId !== null && (
              <div className="bg-amber-100 border-3 border-amber-500 rounded-2xl p-4 flex flex-col gap-3 shadow-xl animate-in fade-in">
                <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                  <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
                    <span>📦</span> Colocar produto na Caixa #{selectedBoxId}
                  </h4>
                  <button
                    onClick={() => setSelectedBoxId(null)}
                    className="text-amber-800 hover:text-amber-950 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                {/* Inventory Picker */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-amber-950">
                    Selecione um item do Celeiro / Silo:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 bg-white/80 rounded-xl border border-amber-300">
                    {(Object.entries(inventory) as [ItemId, number][])
                      .filter(([_, count]) => count > 0)
                      .map(([id, count]) => {
                        const itDef = ITEMS[id];
                        const isChosen = sellItem === id;

                        return (
                          <button
                            key={id}
                            onClick={() => {
                              sound.playClick();
                              setSellItem(id as ItemId);
                              setSellCount(1);
                              setSellPrice(Math.round((itDef?.basePrice || 10) * 1.5));
                            }}
                            className={`p-1.5 rounded-xl border flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-amber-200 border-amber-700 scale-105 shadow ring-2 ring-amber-500'
                                : 'bg-white hover:bg-amber-50 border-amber-200'
                            }`}
                          >
                            <span className="text-2xl">{itDef?.icon}</span>
                            <span className="text-[9px] font-black text-amber-950 truncate w-full text-center">
                              {itDef?.name}
                            </span>
                            <span className="text-[9px] font-bold text-green-800">
                              x{count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Amount, Price, and Newspaper Toggle */}
                {sellItem && (
                  <div className="flex flex-col gap-2.5 bg-white/95 p-3 rounded-xl border border-amber-300 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-950">Qtd:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSellCount((p) => Math.max(1, p - 1))}
                            className="w-7 h-7 bg-amber-200 hover:bg-amber-300 rounded-lg font-black text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-sm px-2.5 text-amber-950">
                            {sellCount}
                          </span>
                          <button
                            onClick={() =>
                              setSellCount((p) =>
                                Math.min(inventory[sellItem!] || 1, p + 1)
                              )
                            }
                            className="w-7 h-7 bg-amber-200 hover:bg-amber-300 rounded-lg font-black text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-950">Preço:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setSellPrice((p) => Math.max(5, p - 5))
                            }
                            className="w-7 h-7 bg-amber-200 hover:bg-amber-300 rounded-lg font-black text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-black text-sm px-2.5 text-amber-950">
                            🪙 {sellPrice}
                          </span>
                          <button
                            onClick={() => setSellPrice((p) => p + 5)}
                            className="w-7 h-7 bg-amber-200 hover:bg-amber-300 rounded-lg font-black text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Advertise toggle */}
                      <label className="flex items-center gap-2 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300">
                        <input
                          type="checkbox"
                          checked={sellAdvertised}
                          onChange={(e) => setSellAdvertised(e.target.checked)}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                          <span>📢</span> Anunciar no Jornal
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={handleConfirmSale}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-xs sm:text-sm py-2.5 rounded-xl shadow border border-white active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🏪</span> Publicar Venda na Banca
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Newspaper Market (Daily Dirt / Jornal do Fazendeiro) */}
        {activeTab === 'newspaper' && (
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {/* Newspaper vintage header bar */}
            <div className="bg-[#fff9e6] rounded-2xl p-3 border-2 border-amber-700/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗞️</span>
                  <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wider">
                    O Diário da Cidade • Mercado Multiplayer
                  </h3>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Compre ofertas reais postadas por outros fazendeiros conectados!
                </p>
              </div>

              <button
                onClick={handleManualRefresh}
                className="flex items-center gap-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-black px-3 py-1.5 rounded-xl border border-amber-400 shadow-xs cursor-pointer self-end sm:self-auto"
              >
                <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
                <span>Atualizar Edição</span>
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setNewspaperFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  newspaperFilter === 'all'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-300'
                }`}
              >
                Todos ({newspaperOffers.filter((o) => o.advertised).length})
              </button>
              <button
                onClick={() => setNewspaperFilter('real_players')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  newspaperFilter === 'real_players'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-300'
                }`}
              >
                <span>👥</span> Jogadores Reais
              </button>
              <button
                onClick={() => setNewspaperFilter('expansion')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  newspaperFilter === 'expansion'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-300'
                }`}
              >
                🪵 Expansão & Ferramentas
              </button>
              <button
                onClick={() => setNewspaperFilter('crops')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  newspaperFilter === 'crops'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-300'
                }`}
              >
                🌾 Colheitas
              </button>
              <button
                onClick={() => setNewspaperFilter('products')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  newspaperFilter === 'products'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white/80 text-amber-900 hover:bg-white border border-amber-300'
                }`}
              >
                🍞 Produtos
              </button>
            </div>

            {/* Newspaper Grid */}
            {filteredOffers.length === 0 ? (
              <div className="p-8 text-center bg-white/70 rounded-2xl border-2 border-dashed border-amber-300 text-amber-800">
                <span className="text-4xl block mb-2">📰</span>
                <p className="font-black text-sm">Nenhum anúncio nesta categoria no momento.</p>
                <p className="text-xs mt-1 text-amber-700">
                  Coloque itens à venda na sua banca e anuncie no jornal para ver aqui!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredOffers.map((offer) => {
                  const itDef = ITEMS[offer.itemId];
                  const isMine = offer.sellerFarmId === myFarmId;
                  const canAfford = coins >= offer.price;
                  const isRealPlayer = !offer.sellerFarmId.startsWith('npc_');

                  return (
                    <div
                      key={offer.id}
                      className={`p-3 rounded-2xl border-2 shadow-xs flex items-center justify-between gap-3 relative transition-all ${
                        offer.isSold
                          ? 'bg-gray-100 border-gray-300 opacity-75'
                          : isMine
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/60'
                          : isRealPlayer
                          ? 'bg-white border-amber-400 shadow-sm'
                          : 'bg-white border-amber-300'
                      }`}
                    >
                      {/* Real Player Tag */}
                      {isRealPlayer && (
                        <div className="absolute -top-2 left-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.2 rounded-full border border-white shadow-xs">
                          {isMine ? 'Sua Oferta' : '👤 Jogador Online'}
                        </div>
                      )}

                      {/* Left: Item and Seller */}
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 bg-amber-100/80 rounded-2xl border border-amber-300 flex items-center justify-center text-3xl shadow-inner relative">
                          {itDef?.icon || '📦'}
                          {offer.isSold && (
                            <div className="absolute inset-0 bg-red-900/60 rounded-2xl flex items-center justify-center">
                              <span className="text-white text-[10px] font-black rotate-[-15deg] bg-red-600 px-1 py-0.5 rounded border border-white shadow">
                                ESGOTADO
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-xs sm:text-sm text-amber-950 leading-tight">
                            {offer.count}x {itDef?.name || offer.itemId}
                          </h4>

                          <div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-semibold mt-0.5">
                            <span className="inline-flex items-center">
                              {offer.sellerAvatar && offer.sellerAvatar.startsWith('http') ? (
                                <img src={offer.sellerAvatar} alt="Avatar" className="w-4.5 h-4.5 rounded-full object-cover border border-amber-300" />
                              ) : (
                                offer.sellerAvatar
                              )}
                            </span>
                            <span className="truncate max-w-[110px]">{offer.sellerFarmName}</span>
                            <span className="text-amber-600">• Nv.{offer.sellerLevel}</span>
                          </div>

                          {offer.isSold && offer.buyerFarmName && (
                            <span className="text-[9px] text-emerald-800 font-bold block mt-0.5">
                              Comprado por {offer.buyerFarmName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1 font-black text-xs text-amber-950 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                          <span>🪙</span>
                          <span>{offer.price}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Visit button */}
                          <button
                            onClick={() => {
                              sound.playClick();
                              onVisitFarm(offer.sellerFarmId);
                              onClose();
                            }}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-black border border-amber-300 shadow-xs cursor-pointer"
                            title="Visitar a fazenda deste jogador"
                          >
                            🚶
                          </button>

                          {/* Buy button */}
                          <button
                            disabled={offer.isSold || isMine || !canAfford}
                            onClick={() => {
                              onBuyNewspaperItem(offer.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 cursor-pointer ${
                              offer.isSold
                                ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                : isMine
                                ? 'bg-amber-200 text-amber-800 border-amber-300 cursor-default text-[10px]'
                                : canAfford
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 border-white active:scale-95'
                                : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {offer.isSold ? (
                              <span>Vendido</span>
                            ) : isMine ? (
                              <span>Sua Banca</span>
                            ) : (
                              <span>Comprar</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
