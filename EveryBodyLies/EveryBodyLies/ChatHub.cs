using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace EveryBodyLies
{
    public class ChatHub : Hub
    {
        public static List<Jogador> listaJogadores = new List<Jogador>();

        private object _syncRoot = new object();

        public void Send(string message)
        {
            // Call the broadcastMessage method to update clients.
            var jogador = listaJogadores.FirstOrDefault(x => x.id == Context.ConnectionId);

            if (jogador != null)
            {
                Clients.All.broadcastMessage(jogador.nome, message);
            } else
            {
                Clients.All.broadcastMessage("Anonimo", message);
            }
            
        }

        public void criarSala(string data)
        {

        }

        public void RegisterClient(String data)
        {
            lock (_syncRoot)
            {
                var jogador = listaJogadores.FirstOrDefault(x => x.id == Context.ConnectionId);

                if (jogador == null)
                {
                    jogador = new Jogador();
                    jogador.id = Context.ConnectionId;
                    jogador.nome = data;
                    listaJogadores.Add(jogador);
                }

                jogador.isPlaying = false;
            }

            int quantidadeJogadores = listaJogadores.Count();

            Clients.Client(Context.ConnectionId).registerComplete(data, quantidadeJogadores);
        }
    }
}