        // Variáveis globais
        let currentBalance = 0;
        let balanceVisible = true;
        let transactions = [
            {
                id: 1,
                type: 'deposit',
                description: 'Salário - Empresa XYZ',
                amount: 5000.00,
                date: new Date('2024-01-15T10:30:00'),
                status: 'completed'
            },
            {
                id: 2,
                type: 'transfer',
                description: 'Transferência para Maria Silva',
                amount: -250.00,
                date: new Date('2024-01-14T15:45:00'),
                status: 'completed'
            },
            {
                id: 3,
                type: 'payment',
                description: 'Conta de Luz - CEMIG',
                amount: -180.50,
                date: new Date('2024-01-13T09:20:00'),
                status: 'completed'
            },
            {
                id: 4,
                type: 'deposit',
                description: 'PIX Recebido - João Santos',
                amount: 75.00,
                date: new Date('2024-01-12T18:10:00'),
                status: 'completed'
            },
            {
                id: 5,
                type: 'payment',
                description: 'Supermercado ABC',
                amount: -320.80,
                date: new Date('2024-01-11T14:30:00'),
                status: 'completed'
            }
        ];

        // Inicializa a aplicação
        document.addEventListener('DOMContentLoaded', function() {
            updateBalance();
            renderTransactions();
            
            // Alternar visibilidade do saldo
            document.getElementById('toggleBalance').addEventListener('click', toggleBalanceVisibility);
        });

        // Funções de modal
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Funções de saldo
        function updateBalance() {
            const balanceElement = document.getElementById('balance');
            if (balanceVisible) {
                balanceElement.textContent = `R$ ${currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            } else {
                balanceElement.textContent = 'R$ ••••••';
            }
        }

        function toggleBalanceVisibility() {
            balanceVisible = !balanceVisible;
            updateBalance();
            
            const icon = document.getElementById('toggleBalance');
            icon.className = balanceVisible ? 'fas fa-eye text-white/80 text-xl cursor-pointer hover:text-white' : 'fas fa-eye-slash text-white/80 text-xl cursor-pointer hover:text-white';
        }

        // Funções de transações
        function renderTransactions() {
            const container = document.getElementById('transactionsList');
            container.innerHTML = '';

            transactions.slice(0, 5).forEach(transaction => {
                const transactionElement = createTransactionElement(transaction);
                container.appendChild(transactionElement);
            });
        }

        function createTransactionElement(transaction) {
            const div = document.createElement('div');
            div.className = 'p-4 transaction-item';
            
            const isPositive = transaction.amount > 0;
            const icon = getTransactionIcon(transaction.type);
            const color = getTransactionColor(transaction.type);
            
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 ${color} rounded-full flex items-center justify-center">
                            <i class="${icon} text-white text-sm"></i>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">${transaction.description}</p>
                            <p class="text-xs text-gray-500">${formatDate(transaction.date)}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}">
                            ${isPositive ? '+' : ''}R$ ${Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p class="text-xs text-gray-500 capitalize">${transaction.status}</p>
                    </div>
                </div>
            `;
            
            return div;
        }

        function getTransactionIcon(type) {
            const icons = {
                'deposit': 'fas fa-arrow-down',
                'transfer': 'fas fa-exchange-alt',
                'payment': 'fas fa-credit-card'
            };
            return icons[type] || 'fas fa-circle';
        }

        function getTransactionColor(type) {
            const colors = {
                'deposit': 'bg-green-500',
                'transfer': 'bg-blue-500',
                'payment': 'bg-purple-500'
            };
            return colors[type] || 'bg-gray-500';
        }

        function formatDate(date) {
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return 'Hoje';
            } else if (diffDays === 2) {
                return 'Ontem';
            } else if (diffDays <= 7) {
                return `${diffDays - 1} dias atrás`;
            } else {
                return date.toLocaleDateString('pt-BR');
            }
        }

        // Manipuladores de formulário
        function handleDeposit(event) {
            event.preventDefault();
            const form = event.target;
            const amount = parseFloat(form.querySelector('input[type="number"]').value);
            const description = form.querySelector('input[type="text"]').value || 'Depósito';
            
            // Adiciona transação
            const newTransaction = {
                id: Date.now(),
                type: 'deposit',
                description: description,
                amount: amount,
                date: new Date(),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            currentBalance += amount;
            
            // Atualiza UI
            updateBalance();
            renderTransactions();
            showNotification('Depósito realizado com sucesso!', 'success');
            
            // Fecha modal e limpa formulário
            closeModal('depositModal');
            form.reset();
        }

        function handleTransfer(event) {
            event.preventDefault();
            const form = event.target;
            const recipient = form.querySelector('input[type="text"]').value;
            const amount = parseFloat(form.querySelectorAll('input[type="number"]')[0].value);
            const description = form.querySelectorAll('input[type="text"]')[1].value;
            
            if (amount > currentBalance) {
                showNotification('Saldo insuficiente para esta transferência!', 'error');
                return;
            }
            
            // Adiciona transação
            const newTransaction = {
                id: Date.now(),
                type: 'transfer',
                description: `Transferência para ${recipient} - ${description}`,
                amount: -amount,
                date: new Date(),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            currentBalance -= amount;
            
            // Atualiza UI
            updateBalance();
            renderTransactions();
            showNotification('Transferência realizada com sucesso!', 'success');
            
            // Fecha modal e limpa formulário
            closeModal('transferModal');
            form.reset();
        }

        function handlePayment(event) {
            event.preventDefault();
            const form = event.target;
            const code = form.querySelector('input[type="text"]').value;
            const amount = parseFloat(form.querySelector('input[type="number"]').value);
            const description = form.querySelectorAll('input[type="text"]')[1].value;
            
            if (amount > currentBalance) {
                showNotification('Saldo insuficiente para este pagamento!', 'error');
                return;
            }
            
            // Adiciona transação
            const newTransaction = {
                id: Date.now(),
                type: 'payment',
                description: description,
                amount: -amount,
                date: new Date(),
                status: 'completed'
            };
            
            transactions.unshift(newTransaction);
            currentBalance -= amount;
            
            // Atualiza UI
            updateBalance();
            renderTransactions();
            showNotification('Pagamento realizado com sucesso!', 'success');
            
            // Fecha modal e limpa formulário
            closeModal('paymentModal');
            form.reset();
        }

        // Sistema de notificações
        function showNotification(message, type = 'info') {
            const container = document.getElementById('notificationsContainer');
            const notification = document.createElement('div');
            
            const colors = {
                'success': 'bg-green-500',
                'error': 'bg-red-500',
                'info': 'bg-blue-500',
                'warning': 'bg-yellow-500'
            };
            
            const icons = {
                'success': 'fas fa-check-circle',
                'error': 'fas fa-exclamation-circle',
                'info': 'fas fa-info-circle',
                'warning': 'fas fa-exclamation-triangle'
            };
            
            notification.className = `notification ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-80`;
            notification.innerHTML = `
                <i class="${icons[type]}"></i>
                <span class="text-sm font-medium">${message}</span>
                <button onclick="removeNotification(this)" class="ml-auto text-white/80 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(notification);
            
            // Remove automaticamente após 5 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    removeNotification(notification.querySelector('button'));
                }
            }, 5000);
        }

        function removeNotification(button) {
            const notification = button.closest('.notification');
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }

        // Fecha modais ao clicar fora
        document.addEventListener('click', function(event) {
            const modals = ['depositModal', 'transferModal', 'paymentModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (event.target === modal) {
                    closeModal(modalId);
                }
            });
        });

        // Fecha modais com tecla Esc
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modals = ['depositModal', 'transferModal', 'paymentModal'];
                modals.forEach(modalId => {
                    const modal = document.getElementById(modalId);
                    if (!modal.classList.contains('hidden')) {
                        closeModal(modalId);
                    }
                });
            }
        });
