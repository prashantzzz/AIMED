#include<iostream>
#include <vector>
#include<queue>
#include<stack>
#include<unordered_map>
using namespace std;

int bfs(vector<vector<int>>arr){
    queue<int>q;
    q.push(1);
    unordered_map<int,int>mp;
    mp[1]=1;
    while(!q.empty()){
        int f=q.front();
        q.pop();
        cout<<f<<" ";
        
        for(int j=0; j<arr[f].size(); j++){
            if(mp[arr[f][j]]==0){
                mp[arr[f][j]]=1;
                q.push(arr[f][j]);
            }
        }
    }
}

int dfs(vector<vector<int>>arr){
    stack<int>q;
    q.push(1);
    unordered_map<int,int>mp;
    mp[1]=1;
    while(!q.empty()){
        int f=q.top();
        q.pop();
        cout<<f<<" ";
        
        for(int j=0; j<arr[f].size(); j++){
            if(mp[arr[f][j]]==0){
                mp[arr[f][j]]=1;
                q.push(arr[f][j]);
            }
        }
    }
}

int main(){
    int e,v,a,b;
    cin>>v>>e;
    vector<vector<int>>arr(v+1);
    for(int i=0; i<e; i++){
        cin>>a>>b;
        arr[a].push_back(b);
        arr[b].push_back(a);
    }

    // bfs(arr);
    dfs(arr);

    // for(int i=1; i<v+1; i++){
    //     cout<<i<<"->";
    //     for(int j=0; j<arr[i].size(); j++){
    //         cout<<arr[i][j]<<" ";
    //     }
    //     cout<<endl;
    // }

    return 0;
}
/*input
5 6
1 3
1 2
2 4
3 4
2 5
4 5
*/